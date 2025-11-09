import { Search, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const categoriesFiltersSchema = z.object({
  categoryName: z.string().optional(),
})

type CategoryFiltersSchema = z.infer<typeof categoriesFiltersSchema>

export function CategoryTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const categoryName = searchParams.get('categoryName')

  const { register, handleSubmit, reset } = useForm<CategoryFiltersSchema>({
    defaultValues: {
      categoryName: categoryName ?? '',
    },
  })

  function handleFilter(data: CategoryFiltersSchema) {
    const categoryName = data.categoryName?.toString()

    setSearchParams((prev) => {
      if (categoryName) {
        prev.set('categoryName', categoryName)
      } else {
        prev.delete('categoryName')
      }

      prev.set('page', '1')

      return prev
    })
  }

  function handleClearFilters() {
    setSearchParams((prev) => {
      prev.delete('categoryName')
      prev.set('page', '1')

      return prev
    })

    reset({
      categoryName: '',
    })
  }

  const hasAnyFilter = !!categoryName

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="flex flex-col items-center gap-2 md:flex-row"
    >
      <Input
        placeholder="Nome da categoria"
        className="h-8 w-full md:w-[320px]"
        {...register('categoryName')}
      />

      <div className="flex flex-wrap gap-2">
        <Button type="submit" variant="secondary" size="xs">
          <Search className="size-4" />
          Filtrar resultados
        </Button>

        <Button
          type="button"
          variant="outline"
          size="xs"
          disabled={!hasAnyFilter}
          onClick={handleClearFilters}
        >
          <X className="size-4" />
          Remover filtros
        </Button>
      </div>
    </form>
  )
}
