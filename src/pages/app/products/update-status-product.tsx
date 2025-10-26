import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { updateStatusProduct } from '@/api/products/update-status-product'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Switch } from '@/components/ui/switch'
import { queryClient } from '@/lib/react-query'

interface UpdateStatusProductProps {
  productId: string
  productName: string
  currentStatus: boolean
}

export function UpdateStatusProduct({
  productId,
  productName,
  currentStatus,
}: UpdateStatusProductProps) {
  const [isOpen, setIsOpen] = useState(false)

  const { mutateAsync: updateStatusProductFn, isPending } = useMutation({
    mutationFn: updateStatusProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['products'],
      })

      toast.success(
        `Produto ${currentStatus ? 'desativado' : 'ativado'} com sucesso!`,
      )

      setIsOpen(false)
    },
  })

  async function handleUpdateStatus() {
    await updateStatusProductFn({ productId })
  }

  function handleSwitchClick() {
    setIsOpen(true)
  }

  const actionText = currentStatus ? 'Desativar' : 'Ativar'

  return (
    <>
      <Switch
        checked={currentStatus}
        onClick={handleSwitchClick}
        disabled={isPending}
      />

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionText} {productName}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {currentStatus
                ? 'Ao desativar este produto, ele não será mais exibido no cardápio da loja para os clientes.'
                : 'Ao ativar este produto, ele voltará a ser exibido no cardápio da loja para os clientes.'}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUpdateStatus}
              disabled={isPending}
              className={
                currentStatus
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  : ''
              }
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {currentStatus ? 'Desativando...' : 'Ativando...'}
                </>
              ) : (
                actionText
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
