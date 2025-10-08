import { useQuery } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { getProducts } from '@/api/products/get-products'
import { Pagination } from '@/components/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { ProductTableFilters } from './product-table-filters'
import { ProductTableRow } from './product-table-row'
import { ProductsTableSkeleton } from './products-table-skeleton'

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams()

  const productName = searchParams.get('productName')
  const categoryId = searchParams.get('categoryId')
  const active = searchParams.get('active')

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1')

  const {
    data: result,
    isFetching: isFetchingProducts,
    isLoading: isLoadingProducts,
  } = useQuery({
    queryKey: ['products', productName, categoryId, active, pageIndex],
    queryFn: () =>
      getProducts({
        pageIndex,
        productName,
        categoryId: categoryId === 'all' ? null : categoryId,
        active: active === 'all' || !active ? null : active === 'true',
      }),
  })

  function handlePaginate(pageIndex: number) {
    setSearchParams((prev) => {
      prev.set('page', (pageIndex + 1).toString())

      return prev
    })
  }

  return (
    <>
      <Helmet title="Produtos" />
      <div className="flex flex-col gap-4">
        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
          Produtos
          {isFetchingProducts && (
            <Loader2Icon className="text-muted-foreground h-5 w-5 animate-spin" />
          )}
        </h1>
        <div className="space-y-2.5">
          <ProductTableFilters />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[200px]">Nome</TableHead>
                  <TableHead className="w-[140px]">Categoria</TableHead>
                  <TableHead className="w-[140px]">Preço</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-[164px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingProducts && !result && <ProductsTableSkeleton />}

                {result &&
                  result.products.map((product) => {
                    return (
                      <ProductTableRow key={product.id} product={product} />
                    )
                  })}

                {result && result.products.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-muted-foreground py-10 text-center"
                    >
                      Nenhum resultado encontrado.
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
