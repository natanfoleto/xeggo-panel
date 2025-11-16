import { useQuery } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { getOrders } from '@/api/manager/orders/get-orders'
import { Pagination } from '@/components/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { OrderTableFilters } from './order-table-filters'
import { OrderTableRow } from './order-table-row'
import { OrdersTableSkeleton } from './orders-table-skeleton'

export function Orders() {
  const [searchParams, setSearchParams] = useSearchParams()

  const orderId = searchParams.get('orderId')
  const customerName = searchParams.get('customerName')
  const status = searchParams.get('status')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1')

  const {
    data: ordersData,
    isFetching: isFetchingOrders,
    isLoading: isLoadingOrders,
  } = useQuery({
    queryKey: ['orders', customerName, orderId, status, from, to, pageIndex],
    queryFn: () =>
      getOrders({
        pageIndex,
        customerName,
        orderId,
        status: status === 'all' ? null : status,
        from,
        to,
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
      <Helmet title="Pedidos" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 2xl:max-w-384">
        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
          Pedidos
          {isFetchingOrders && (
            <Loader2Icon className="text-muted-foreground size-5 animate-spin" />
          )}
        </h1>

        <div className="space-y-3">
          <OrderTableFilters />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16"></TableHead>
                  <TableHead className="w-52">Identificador</TableHead>
                  <TableHead className="w-28">Realizado há</TableHead>
                  <TableHead className="w-36">Status</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="w-36">Total do pedido</TableHead>
                  <TableHead className="w-[348px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingOrders && !ordersData && <OrdersTableSkeleton />}

                {ordersData &&
                  ordersData.orders.map((order) => {
                    return <OrderTableRow key={order.orderId} order={order} />
                  })}

                {ordersData && ordersData.orders.length === 0 && (
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

          {ordersData && (
            <Pagination
              pageIndex={pageIndex}
              totalCount={ordersData.meta.totalCount}
              perPage={ordersData.meta.perPage}
              onPageChange={handlePaginate}
            />
          )}
        </div>
      </div>
    </>
  )
}
