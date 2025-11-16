import { useQuery } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { getProducts } from '@/api/manager/products/get-products'
import { Pagination } from '@/components/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { NewProduct } from './new-product'
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
    data: productsData,
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

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 2xl:max-w-384">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
            Produtos
            {isFetchingProducts && (
              <Loader2Icon className="text-muted-foreground size-5 animate-spin" />
            )}
          </h1>

          <NewProduct />
        </div>

        <div className="space-y-2.5">
          <ProductTableFilters />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16"></TableHead>
                  <TableHead className="w-[250px]">Nome</TableHead>
                  <TableHead className="w-[140px]">Categoria</TableHead>
                  <TableHead className="w-[140px] text-center">Preço</TableHead>
                  <TableHead className="w-[100px] text-center">
                    Status
                  </TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-32"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingProducts && !productsData && (
                  <ProductsTableSkeleton />
                )}

                {productsData &&
                  productsData.products.map((product) => {
                    return (
                      <ProductTableRow key={product.id} product={product} />
                    )
                  })}

                {productsData && productsData.products.length === 0 && (
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

          {productsData && (
            <Pagination
              pageIndex={pageIndex}
              totalCount={productsData.meta.totalCount}
              perPage={productsData.meta.perPage}
              onPageChange={handlePaginate}
            />
          )}
        </div>
      </div>
    </>
  )
}
