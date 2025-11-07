import { useMutation } from '@tanstack/react-query'
import { Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { deleteCategory } from '@/api/categories/delete-category'
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

      appalert.success('Excelente', 'Categoria deletada com sucesso.')

      setIsOpen(false)
    },
  })

  async function handleDeleteCategory() {
    await deleteCategoryFn({ categoryId })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button className="size-8" variant="outline">
          <Trash2 />
        </Button>
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
