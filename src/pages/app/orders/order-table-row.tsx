import { useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowRight, Loader2, Search } from 'lucide-react'
import { useState } from 'react'

import { approveOrder } from '@/api/orders/approve-order'
import { deliverOrder } from '@/api/orders/deliver-order'
import { dispatchOrder } from '@/api/orders/dispatch-order'
import type { GetOrdersResponse } from '@/api/orders/get-orders'
import { appalert } from '@/components/app-alert/app-alert-context'
import { OrderStatus } from '@/components/order-status'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/utils/format-currency'

import { CancelOrder } from './cancel-order'
import { OrderDetails } from './order-details'

type OrderStatus =
  | 'pending'
  | 'canceled'
  | 'processing'
  | 'delivering'
  | 'delivered'

export interface OrderTableRowProps {
  order: {
    orderId: string
    createdAt: string
    customerName: string
    totalItemsQuantity: number
    total: number
    status: OrderStatus
  }
}

export function OrderTableRow({ order }: OrderTableRowProps) {
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)
  const [isCancelOrderOpen, setIsCancelOrderOpen] = useState(false)

  const queryClient = useQueryClient()

  function updateOrderStatusOnCache(orderId: string, status: OrderStatus) {
    const ordersListingCache = queryClient.getQueriesData<GetOrdersResponse>({
      queryKey: ['orders'],
    })

    ordersListingCache.forEach(([cacheKey, cached]) => {
      if (!cached) {
        return
      }

      queryClient.setQueryData<GetOrdersResponse>(cacheKey, {
        ...cached,
        orders: cached.orders.map((order) => {
          if (order.orderId !== orderId) {
            return order
          }

          return {
            ...order,
            status,
          }
        }),
      })
    })

    appalert.success('Excelente', 'Pedido alterado com sucesso.')
  }

  const { mutateAsync: approveOrderFn, isPending: isApprovingOrder } =
    useMutation({
      mutationFn: approveOrder,
      onSuccess: async (_, { orderId }) => {
        updateOrderStatusOnCache(orderId, 'processing')
      },
    })

  const { mutateAsync: dispatchOrderFn, isPending: isDispatchingOrder } =
    useMutation({
      mutationFn: dispatchOrder,
      onSuccess: async (_, { orderId }) => {
        updateOrderStatusOnCache(orderId, 'delivering')
      },
    })

  const { mutateAsync: deliverOrderFn, isPending: isDeliveringOrder } =
    useMutation({
      mutationFn: deliverOrder,
      onSuccess: async (_, { orderId }) => {
        updateOrderStatusOnCache(orderId, 'delivered')
      },
    })

  return (
    <TableRow>
      <TableCell>
        <Dialog onOpenChange={setIsOrderDetailsOpen} open={isOrderDetailsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="size-3" />
              <span className="sr-only">Detalhes do pedido</span>
            </Button>
          </DialogTrigger>

          <OrderDetails open={isOrderDetailsOpen} orderId={order.orderId} />
        </Dialog>
      </TableCell>

      <TableCell className="font-mono text-xs font-medium">
        {order.orderId}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDistanceToNow(new Date(order.createdAt), {
          locale: ptBR,
          addSuffix: true,
        })}
      </TableCell>

      <TableCell>
        <OrderStatus status={order.status} />
      </TableCell>

      <TableCell className="font-medium">{order.customerName}</TableCell>

      <TableCell>
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">
            {formatCurrency(order.total / 100)}
          </span>

          <span className="text-muted-foreground text-xs">
            {order.totalItemsQuantity} produto(s)
          </span>
        </div>
      </TableCell>

      <TableCell>
        {order.status === 'processing' && (
          <Button
            variant="outline"
            size="xs"
            disabled={isDispatchingOrder}
            onClick={() => dispatchOrderFn({ orderId: order.orderId })}
          >
            Em entrega
            {isDispatchingOrder ? (
              <Loader2 className="ml-2 size-3 animate-spin" />
            ) : (
              <ArrowRight className="ml-2 size-3" />
            )}
          </Button>
        )}

        {order.status === 'delivering' && (
          <Button
            variant="outline"
            size="xs"
            disabled={isDeliveringOrder}
            onClick={() => deliverOrderFn({ orderId: order.orderId })}
          >
            Entregue
            {isDeliveringOrder ? (
              <Loader2 className="ml-2 size-3 animate-spin" />
            ) : (
              <ArrowRight className="ml-2 size-3" />
            )}
          </Button>
        )}

        {order.status === 'pending' && (
          <Button
            variant="outline"
            size="xs"
            disabled={isApprovingOrder}
            onClick={() => approveOrderFn({ orderId: order.orderId })}
          >
            Aprovar
            {isApprovingOrder ? (
              <Loader2 className="ml-2 size-3 animate-spin" />
            ) : (
              <ArrowRight className="ml-2 size-3" />
            )}
          </Button>
        )}
      </TableCell>

      <TableCell>
        <Dialog open={isCancelOrderOpen} onOpenChange={setIsCancelOrderOpen}>
          {['pending', 'processing'].includes(order.status) && (
            <DialogTrigger asChild>
              <Button variant="ghost" size="xs">
                Cancelar
              </Button>
            </DialogTrigger>
          )}

          <CancelOrder
            orderId={order.orderId}
            onClose={() => setIsCancelOrderOpen(false)}
          />
        </Dialog>
      </TableCell>
    </TableRow>
  )
}
