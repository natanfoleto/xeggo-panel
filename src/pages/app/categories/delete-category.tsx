import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { deleteCategory } from '@/api/categories/delete-category'
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

interface DeleteCategoryProps {
  categoryId: string
  categoryName: string
}

export function DeleteCategory({
  categoryId,
  categoryName,
}: DeleteCategoryProps) {
  const [isOpen, setIsOpen] = useState(false)

  const { mutateAsync: deleteCategoryFn, isPending } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['categories'],
      })

      toast.success('Categoria deletada com sucesso!')

      setIsOpen(false)
    },
  })

  async function handleDeleteCategory() {
    await deleteCategoryFn({ categoryId })
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
          <AlertDialogTitle>Deletar {categoryName}?</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a categoria {categoryName}? Essa ação
            não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteCategory}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
