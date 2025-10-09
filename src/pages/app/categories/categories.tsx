import { useQuery } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { getCategories } from '@/api/categories/get-categories'
import { Pagination } from '@/components/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { CategoriesTableSkeleton } from './categories-table-skeleton'
import { CategoryTableRow } from './category-table-row'
import { NewCategory } from './new-category'

export function Categories() {
  const [searchParams, setSearchParams] = useSearchParams()

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1')

  const {
    data: result,
    isFetching: isFetchingCategories,
    isLoading: isLoadingCategories,
  } = useQuery({
    queryKey: ['categories', pageIndex],
    queryFn: () => getCategories({ pageIndex }),
  })

  function handlePaginate(pageIndex: number) {
    setSearchParams((prev) => {
      prev.set('page', (pageIndex + 1).toString())

      return prev
    })
  }

  return (
    <>
      <Helmet title="Categorias" />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
            Categorias
            {isFetchingCategories && (
              <Loader2Icon className="text-muted-foreground h-5 w-5 animate-spin" />
            )}
          </h1>

          <NewCategory />
        </div>

        <div className="space-y-2.5">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-[64px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingCategories && !result && <CategoriesTableSkeleton />}

                {result &&
                  result.categories.map((category) => {
                    return (
                      <CategoryTableRow key={category.id} category={category} />
                    )
                  })}

                {result && result.categories.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-muted-foreground py-10 text-center"
                    >
                      Nenhuma categoria encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {result && (
            <Pagination
              pageIndex={pageIndex}
              totalCount={result.meta.totalCount}
              perPage={result.meta.perPage}
              onPageChange={handlePaginate}
            />
          )}
        </div>
      </div>
    </>
  )
}
