import { useQuery } from '@tanstack/react-query'
import { Loader2, Pencil } from 'lucide-react'

import { getCategory } from '@/api/manager/categories/get-category'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { CategoryForm } from './category-form'
import { UpdateCategorySkeleton } from './update-category-skeleton'

interface UpdateCategoryProps {
  categoryId: string
}

export function UpdateCategory({ categoryId }: UpdateCategoryProps) {
  const { data: category, isLoading } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => getCategory({ categoryId }),
    staleTime: 1000 * 60 * 15,
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="size-8" variant="outline">
          <Pencil />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isLoading ? (
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
