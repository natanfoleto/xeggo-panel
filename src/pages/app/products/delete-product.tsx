import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { deleteProduct } from '@/api/products/delete-product'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

interface DeleteProductProps {
  productId: string
  productName: string
}

export function DeleteProduct({ productId, productName }: DeleteProductProps) {
  const [isOpen, setIsOpen] = useState(false)

  const queryClient = useQueryClient()

  const { mutateAsync: deleteProductFn, isPending } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['products'],
      })

      toast.success('Produto inativado com sucesso!')

      setIsOpen(false)
    },
    onError: () => {
      toast.error('Erro ao inativar produto.')
    },
  })

  async function handleDelete() {
    await deleteProductFn({ productId })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Trash2 className="text-muted-foreground size-4" />
          )}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Inativar produto?</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja inativar o produto{' '}
            <span className="text-foreground font-semibold">{productName}</span>
            ?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Inativando...
              </>
            ) : (
              'Confirmar'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
