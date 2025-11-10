import { useQuery } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { getCoupons } from '@/api/manager/coupons/get-coupons'
import { Pagination } from '@/components/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { CouponTableFilters } from './coupon-table-filters'
import { CouponTableRow } from './coupon-table-row'
import { CouponsTableSkeleton } from './coupons-table-skeleton'
import { NewCoupon } from './new-coupon'

export function Coupons() {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search')
  const active = searchParams.get('active')

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1')

  const {
    data: result,
    isFetching: isFetchingCoupons,
    isLoading: isLoadingCoupons,
  } = useQuery({
    queryKey: ['coupons', search, active, pageIndex],
    queryFn: () =>
      getCoupons({
        pageIndex,
        search: search ?? undefined,
        active:
          active === 'true' ? true : active === 'false' ? false : undefined,
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
      <Helmet title="Cupons" />

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
            Cupons
            {isFetchingCoupons && (
              <Loader2Icon className="text-muted-foreground size-5 animate-spin" />
            )}
          </h1>

          <NewCoupon />
        </div>

        <div className="space-y-2.5">
          <CouponTableFilters />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Código</TableHead>
                  <TableHead className="w-[150px]">Tipo</TableHead>
                  <TableHead className="w-[100px] text-center">Valor</TableHead>
                  <TableHead className="w-[100px] text-center">Usos</TableHead>
                  <TableHead className="w-[250px]">Expira em</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-22"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingCoupons && !result && <CouponsTableSkeleton />}

                {result &&
                  result.coupons.map((coupon) => {
                    return <CouponTableRow key={coupon.id} coupon={coupon} />
                  })}

                {result && result.coupons.length === 0 && (
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
