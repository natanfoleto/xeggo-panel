import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import { getCategory } from '@/api/categories/get-category'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import { CategoryForm } from './category-form'
import { UpdateCategorySkeleton } from './update-category-skeleton'

interface UpdateCategoryProps {
  categoryId: string
}

export function UpdateCategory({ categoryId }: UpdateCategoryProps) {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => getCategory({ categoryId }),
    staleTime: 1000 * 60 * 15,
  })

  const category = data?.category

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Editar
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isFetching ? (
              <>
                Carregando categoria
                <Loader2 className="text-muted-foreground size-4 animate-spin" />
              </>
            ) : (
              category?.name
            )}
          </DialogTitle>

          <DialogDescription>
            {category && `Atualize as informações de ${category?.name}.`}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <UpdateCategorySkeleton />
        ) : (
          category && <CategoryForm initialData={category} />
        )}
      </DialogContent>
    </Dialog>
  )
}
