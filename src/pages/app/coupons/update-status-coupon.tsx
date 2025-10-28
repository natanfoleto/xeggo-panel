import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { updateStatusCoupon } from '@/api/coupons/update-status-coupon'
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

interface UpdateStatusCouponProps {
  couponId: string
  couponCode: string
  currentStatus: boolean
}

export function UpdateStatusCoupon({
  couponId,
  couponCode,
  currentStatus,
}: UpdateStatusCouponProps) {
  const [isOpen, setIsOpen] = useState(false)

  const { mutateAsync: updateStatusCouponFn, isPending } = useMutation({
    mutationFn: updateStatusCoupon,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['coupons'],
      })

      toast.success(
        `Cupom ${currentStatus ? 'desativado' : 'ativado'} com sucesso!`,
      )

      setIsOpen(false)
    },
  })

  async function handleUpdateStatus() {
    await updateStatusCouponFn({ couponId })
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
              {actionText} cupom {couponCode}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {currentStatus
                ? 'Ao desativar este cupom, ele não poderá mais ser utilizado pelos clientes.'
                : 'Ao ativar este cupom, ele voltará a estar disponível para uso pelos clientes.'}
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
