import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
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
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
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

      toast.success('Produto deletado com sucesso!')

      setIsOpen(false)
    },
  })

  async function handleDeleteProduct() {
    await deleteProductFn({ productId })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Excluir
        </DropdownMenuItem>
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
