import { useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ArrowRight,
  Ban,
  Loader2,
  RefreshCcw,
  Search,
  XCircle,
} from 'lucide-react'
import { useState } from 'react'

import { approveOrder } from '@/api/manager/orders/approve-order'
import { deliverOrder } from '@/api/manager/orders/deliver-order'
import { dispatchOrder } from '@/api/manager/orders/dispatch-order'
import type { GetOrdersResponse } from '@/api/manager/orders/get-orders'
import { resetOrder } from '@/api/manager/orders/reset-order'
import { OrderStatus } from '@/components/order-status'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/utils/format-currency'

import { CancelOrder } from './cancel-order'
import { OrderDetails } from './order-details'

type OrderStatus =
  | 'pending'
  | 'awaiting_payment'
  | 'payment_failed'
  | 'payment_confirmed'
  | 'processing'
  | 'delivering'
  | 'delivered'
  | 'canceled'

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

  const { mutateAsync: resetOrderFn, isPending: isResettingOrder } =
    useMutation({
      mutationFn: resetOrder,
      onSuccess: async (_, { orderId }) => {
        updateOrderStatusOnCache(orderId, 'pending')
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

      <TableCell className="space-x-2 text-right">
        {order.status === 'payment_failed' && (
          <>
            <Button
              title="Aguardar cliente tentar pagar novamente"
              variant="outline"
              size="xs"
              disabled={isResettingOrder}
              onClick={() => resetOrderFn({ orderId: order.orderId })}
            >
              {isResettingOrder ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <RefreshCcw className="size-3" />
              )}
              Aguardar novo pagamento
            </Button>

            <Dialog
              open={isCancelOrderOpen}
              onOpenChange={setIsCancelOrderOpen}
            >
              <DialogTrigger asChild>
                <Button
                  title="Cancelar pedido com pagamento falho"
                  variant="outline"
                  size="xs"
                >
                  <XCircle className="size-3" />
                  Cancelar
                </Button>
              </DialogTrigger>

              <CancelOrder
                orderId={order.orderId}
                onClose={() => setIsCancelOrderOpen(false)}
              />
            </Dialog>
          </>
        )}

        {['pending', 'payment_confirmed'].includes(order.status) && (
          <Button
            title="Aprovar para preparo"
            variant="outline"
            size="xs"
            disabled={isApprovingOrder}
            onClick={() => approveOrderFn({ orderId: order.orderId })}
          >
            {isApprovingOrder ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <ArrowRight className="size-3" />
            )}
            Aprovar
          </Button>
        )}

        {order.status === 'processing' && (
          <Button
            title="Marcar para entrega"
            variant="outline"
            size="xs"
            disabled={isDispatchingOrder}
            onClick={() => dispatchOrderFn({ orderId: order.orderId })}
          >
            {isDispatchingOrder ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <ArrowRight className="size-3" />
            )}
            Em entrega
          </Button>
        )}

        {order.status === 'delivering' && (
          <Button
            title="Marcar como entregue"
            variant="outline"
            size="xs"
            disabled={isDeliveringOrder}
            onClick={() => deliverOrderFn({ orderId: order.orderId })}
          >
            {isDeliveringOrder ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <ArrowRight className="size-3" />
            )}
            Entregue
          </Button>
        )}

        {!['awaiting_payment', 'delivered'].includes(order.status) && (
          <Button
            title="Voltar para status pendente"
            variant="outline"
            size="xs"
            disabled={isResettingOrder}
            onClick={() => resetOrderFn({ orderId: order.orderId })}
          >
            {isResettingOrder ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <RefreshCcw className="size-3" />
            )}
            Reiniciar
          </Button>
        )}

        {['pending', 'processing'].includes(order.status) && (
          <Dialog open={isCancelOrderOpen} onOpenChange={setIsCancelOrderOpen}>
            <DialogTrigger asChild>
              <Button title="Cancelar pedido" variant="outline" size="xs">
                <Ban className="size-3" />
                Cancelar
              </Button>
            </DialogTrigger>

            <CancelOrder
              orderId={order.orderId}
              onClose={() => setIsCancelOrderOpen(false)}
            />
          </Dialog>
        )}
      </TableCell>
    </TableRow>
  )
}
