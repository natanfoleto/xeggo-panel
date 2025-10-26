import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Loader2 } from 'lucide-react'
import React from 'react'

import { getOrderDetails } from '@/api/orders/get-order-details'
import { OrderStatus } from '@/components/order-status'
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
import { formatCurrency } from '@/utils/format-currency'

import { OrderDetailsSkeleton } from './order-details-skeleton'

interface OrderDetailsProps {
  orderId: string
  open: boolean
}

const PAYMENT_METHODS: Record<string, string> = {
  cash: 'Dinheiro',
  creditCard: 'Cartão de Crédito',
  debitCard: 'Cartão de Débito',
  pix: 'PIX',
  voucher: 'Voucher',
  bankTransfer: 'Transferência Bancária',
}

export function OrderDetails({ orderId, open }: OrderDetailsProps) {
  const {
    data: order,
    isLoading: isLoadingOrder,
    isFetching: isFetchingOrder,
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderDetails({ orderId }),
    staleTime: 1000 * 60 * 15, // 15 minutes
    enabled: open,
  })

  return (
    <DialogContent className="max-w-[95vw] sm:max-w-[640px] lg:max-w-[768px]">
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
        <div className="space-y-6">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="text-muted-foreground w-32">
                  Status
                </TableCell>
                <TableCell className="flex justify-end">
                  <OrderStatus status={order.status} />
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
                <TableCell className="text-right break-words">
                  {order.customer.email}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground w-32 align-top">
                  Endereço
                </TableCell>
                <TableCell className="text-right text-sm break-words">
                  {order.deliveryAddress}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground w-32">
                  Pagamento
                </TableCell>
                <TableCell className="text-right text-sm">
                  {order.paymentMethods
                    .map((method) => PAYMENT_METHODS[method] || method)
                    .join(', ')}
                </TableCell>
              </TableRow>
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
                <TableHead className="w-16 text-right">Qtd.</TableHead>
                <TableHead className="w-24 text-right">Preço</TableHead>
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
                      <TableCell className="text-right">
                        {orderItem.quantity}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {formatCurrency(orderItem.priceInCents / 100)}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {formatCurrency(totalWithComplements / 100)}
                      </TableCell>
                    </TableRow>

                    {orderItem.selectedComplements.length > 0 && (
                      <TableRow key={`${orderItem.id}-complements`}>
                        <TableCell colSpan={4} className="p-0">
                          <Accordion type="single" collapsible>
                            <AccordionItem
                              value={`complements-${orderItem.id}`}
                              className="border-0"
                            >
                              <AccordionTrigger className="text-muted-foreground px-4 py-2 text-xs hover:no-underline">
                                Ver complementos (
                                {orderItem.selectedComplements.length})
                              </AccordionTrigger>

                              <AccordionContent className="px-4 pb-2">
                                <div className="ml-4 space-y-1">
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
                                          {(
                                            (complement.priceInCents *
                                              complement.quantity) /
                                            100
                                          ).toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL',
                                          })}
                                        </span>
                                      </div>
                                    ),
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
              <TableRow>
                <TableCell colSpan={3}>Total do pedido</TableCell>

                <TableCell className="text-right font-medium whitespace-nowrap">
                  {formatCurrency(order.totalInCents / 100)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}
    </DialogContent>
  )
}
