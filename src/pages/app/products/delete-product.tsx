import { useMutation } from '@tanstack/react-query'
import { Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { deleteProduct } from '@/api/products/delete-product'
import { appalert } from '@/components/app-alert/app-alert-context'
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
import { queryClient } from '@/lib/react-query'

interface DeleteProductProps {
  productId: string
  productName: string
}

export function DeleteProduct({ productId, productName }: DeleteProductProps) {
  const [isOpen, setIsOpen] = useState(false)

  const { mutateAsync: deleteProductFn, isPending } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['products'],
      })

      appalert.success('Excelente', 'Produto deletado com sucesso.')

      setIsOpen(false)
    },
  })

  async function handleDeleteProduct() {
    await deleteProductFn({ productId })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button className="size-8" variant="outline" title="Deletar">
          <Trash2 />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar {productName}?</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o produto{' '}
            <strong>{productName}</strong>? Essa ação não pode ser desfeita.
            Caso queira remover do cardápio sem excluir, basta desativar o
            produto.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteProduct} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Deletando...
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
