import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Loader2 } from 'lucide-react'
import React from 'react'

import { getOrderDetails } from '@/api/manager/orders/get-order-details'
import { OrderStatusTag } from '@/components/order-status-tag'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { OrderType } from '@/dtos/orders/order-type'
import type { PaymentType } from '@/dtos/orders/payment-type'
import type { PaymentMethod } from '@/dtos/payment-methods/payment-method'
import { formatCurrency } from '@/utils/format-currency'

import { OrderDetailsSkeleton } from './order-details-skeleton'

const PAYMENT_TYPES: Record<PaymentType, string> = {
  online: 'Pagamento online',
  onDelivery: 'Pagamento na entrega/retirada',
}

const PAYMENT_METHODS: Record<PaymentMethod, string> = {
  cash: 'Dinheiro',
  creditCard: 'Cartão de Crédito',
  debitCard: 'Cartão de Débito',
  pix: 'PIX',
}

const ORDER_TYPES: Record<OrderType, string> = {
  delivery: 'Entrega',
  pickup: 'Retirada',
}

interface OrderDetailsProps {
  orderId: string
  open: boolean
}

export function OrderDetails({ orderId, open }: OrderDetailsProps) {
  const {
    data: order,
    isLoading: isLoadingOrder,
    isFetching: isFetchingOrder,
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderDetails({ orderId }),
    staleTime: 1000 * 60 * 15,
    enabled: open,
  })

  const hasCashPayment = order?.paymentMethod === 'cash'

  return (
    <DialogContent className="max-w-[95vw] sm:max-w-[640px] lg:max-w-3xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          Pedido: {orderId}
          {isFetchingOrder && (
            <Loader2 className="text-muted-foreground size-4 animate-spin" />
          )}
        </DialogTitle>
        <DialogDescription>Detalhes do pedido</DialogDescription>
      </DialogHeader>

      {isLoadingOrder && <OrderDetailsSkeleton />}

      {order && (
        <div className="max-h-[80vh] space-y-6 overflow-y-auto pr-2">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="text-muted-foreground w-32">
                  Status
                </TableCell>
                <TableCell className="flex justify-end">
                  <OrderStatusTag status={order.status} />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="text-muted-foreground w-32">
                  Tipo
                </TableCell>
                <TableCell className="text-right">
                  {ORDER_TYPES[order.orderType] || order.orderType}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="text-muted-foreground w-32">
                  Cliente
                </TableCell>
                <TableCell className="text-right">
                  {order.customer.name}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="text-muted-foreground w-32">
                  Telefone
                </TableCell>
                <TableCell className="text-right">
                  {order.customer.phone ?? (
                    <span className="text-muted-foreground italic">
                      Não informado
                    </span>
                  )}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="text-muted-foreground w-32">
                  E-mail
                </TableCell>
                <TableCell className="text-right wrap-break-word">
                  {order.customer.email}
                </TableCell>
              </TableRow>

              {order.deliveryAddress && (
                <TableRow>
                  <TableCell className="text-muted-foreground w-32 align-top">
                    Endereço
                  </TableCell>
                  <TableCell className="text-right text-sm wrap-break-word">
                    {order.deliveryAddress}
                  </TableCell>
                </TableRow>
              )}

              <TableRow>
                <TableCell className="text-muted-foreground w-32">
                  Pagamento
                </TableCell>
                <TableCell className="text-right text-sm">
                  {PAYMENT_METHODS[order.paymentMethod]} -{' '}
                  {PAYMENT_TYPES[order.paymentType]}
                </TableCell>
              </TableRow>

              {hasCashPayment && order.changeForInCents && (
                <TableRow>
                  <TableCell className="text-muted-foreground w-32">
                    Troco para
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(order.changeForInCents / 100)}
                  </TableCell>
                </TableRow>
              )}

              {order.couponCode && (
                <TableRow>
                  <TableCell className="text-muted-foreground w-32">
                    Cupom
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {order.couponCode}
                  </TableCell>
                </TableRow>
              )}

              {order.estimatedDeliveryTime && (
                <TableRow>
                  <TableCell className="text-muted-foreground w-32">
                    Tempo estimado
                  </TableCell>
                  <TableCell className="text-right">
                    {order.estimatedDeliveryTime} minutos
                  </TableCell>
                </TableRow>
              )}

              {order.observations && (
                <TableRow>
                  <TableCell className="text-muted-foreground w-32 align-top">
                    Observações
                  </TableCell>
                  <TableCell className="text-right text-sm wrap-break-word">
                    {order.observations}
                  </TableCell>
                </TableRow>
              )}

              {order.cancellationReason && (
                <TableRow>
                  <TableCell className="text-muted-foreground w-32 align-top">
                    Motivo do cancelamento
                  </TableCell>
                  <TableCell className="text-right text-sm wrap-break-word text-red-400">
                    {order.cancellationReason}
                  </TableCell>
                </TableRow>
              )}

              <TableRow>
                <TableCell className="text-muted-foreground w-32">
                  Criado há
                </TableCell>
                <TableCell className="text-right">
                  {formatDistanceToNow(new Date(order.createdAt), {
                    locale: ptBR,
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className="w-16 text-center">Qtd.</TableHead>
                <TableHead className="w-24 text-center">Preço</TableHead>
                <TableHead className="w-24 text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {order.orderItems.map((orderItem) => {
                const itemSubtotal = orderItem.priceInCents * orderItem.quantity

                const complementsTotal = orderItem.selectedComplements.reduce(
                  (acc, complement) =>
                    acc + complement.priceInCents * complement.quantity,
                  0,
                )

                const totalWithComplements = itemSubtotal + complementsTotal

                return (
                  <React.Fragment key={orderItem.id}>
                    <TableRow>
                      <TableCell>
                        {orderItem.product?.name ?? (
                          <span className="text-muted-foreground italic">
                            Produto removido
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="text-center">
                        {orderItem.quantity}
                      </TableCell>

                      <TableCell className="text-center whitespace-nowrap">
                        {formatCurrency(orderItem.priceInCents / 100)}
                      </TableCell>

                      <TableCell className="text-right whitespace-nowrap">
                        {formatCurrency(totalWithComplements / 100)}
                      </TableCell>
                    </TableRow>

                    {(orderItem.selectedComplements.length > 0 ||
                      orderItem.observations) && (
                      <TableRow key={`${orderItem.id}-details`}>
                        <TableCell colSpan={4} className="p-0">
                          <Accordion type="single" collapsible>
                            <AccordionItem
                              value={`details-${orderItem.id}`}
                              className="border-0"
                            >
                              <AccordionTrigger className="text-muted-foreground px-2 py-1 text-xs hover:no-underline">
                                Ver mais
                              </AccordionTrigger>

                              <AccordionContent className="py-1 pr-2">
                                <div className="ml-4 space-y-1">
                                  {orderItem.selectedComplements.length > 0 && (
                                    <div className="space-y-0.5">
                                      {orderItem.selectedComplements.map(
                                        (complement) => (
                                          <div
                                            key={complement.id}
                                            className="text-muted-foreground flex items-center justify-between text-xs"
                                          >
                                            <span>
                                              {complement.quantity}x{' '}
                                              {complement.complement.name}
                                            </span>

                                            <span className="whitespace-nowrap">
                                              {formatCurrency(
                                                (complement.priceInCents *
                                                  complement.quantity) /
                                                  100,
                                              )}
                                            </span>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  )}

                                  {orderItem.observations && (
                                    <p className="text-muted-foreground text-xs">
                                      {orderItem.observations}
                                    </p>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                )
              })}
            </TableBody>

            <TableFooter>
              <TableRow className="text-xs">
                <TableCell colSpan={3}>Subtotal</TableCell>

                <TableCell className="text-right font-medium whitespace-nowrap">
                  {formatCurrency(order.totalInCents / 100)}
                </TableCell>
              </TableRow>

              {order.deliveryFeeInCents !== null &&
                order.deliveryFeeInCents > 0 && (
                  <TableRow className="text-xs">
                    <TableCell colSpan={3}>Taxa de entrega</TableCell>

                    <TableCell className="text-right font-medium whitespace-nowrap">
                      {formatCurrency(order.deliveryFeeInCents / 100)}
                    </TableCell>
                  </TableRow>
                )}

              {order.discountInCents !== null && order.discountInCents > 0 && (
                <TableRow className="text-xs">
                  <TableCell colSpan={3}>Desconto</TableCell>

                  <TableCell className="text-right font-medium whitespace-nowrap text-green-600">
                    -{formatCurrency(order.discountInCents / 100)}
                  </TableCell>
                </TableRow>
              )}

              <TableRow>
                <TableCell colSpan={3} className="font-medium">
                  Total do pedido
                </TableCell>

                <TableCell className="text-right font-medium whitespace-nowrap">
                  {formatCurrency(
                    (order.totalInCents +
                      (order.deliveryFeeInCents || 0) -
                      (order.discountInCents || 0)) /
                      100,
                  )}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}
    </DialogContent>
  )
}
