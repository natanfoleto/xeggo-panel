import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Loader2 } from 'lucide-react'

import { getOrderDetails } from '@/api/get-order-details'
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

import { OrderDetailsSkeleton } from './order-details-skeleton'

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
    staleTime: 1000 * 60 * 15, // 15 minutes
    enabled: open,
  })

  return (
    <DialogContent className="sm:max-w-[520px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          Pedido: {orderId}
          {isFetchingOrder && (
            <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
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
                <TableCell className="text-muted-foreground">Status</TableCell>
                <TableCell className="flex justify-end">
                  <OrderStatus status={order.status} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Cliente</TableCell>
                <TableCell className="text-right">
                  {order.customer.name}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
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
                <TableCell className="text-muted-foreground">E-mail</TableCell>
                <TableCell className="text-right">
                  {order.customer.email}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
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
                <TableHead className="text-right">Qtd.</TableHead>
                <TableHead className="text-right">Preço</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
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
                  <>
                    <TableRow key={orderItem.id}>
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
                      <TableCell className="text-right">
                        {(orderItem.priceInCents / 100).toLocaleString(
                          'pt-BR',
                          {
                            style: 'currency',
                            currency: 'BRL',
                          },
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {(totalWithComplements / 100).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </TableCell>
                    </TableRow>

                    {orderItem.selectedComplements.length > 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="p-0">
                          <Accordion type="single" collapsible>
                            <AccordionItem
                              value="complements"
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
                                          • {complement.complement.name}
                                          {complement.quantity > 1 &&
                                            ` (${complement.quantity}x)`}
                                        </span>
                                        <span>
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
                  </>
                )
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total do pedido</TableCell>
                <TableCell className="text-right font-medium">
                  {(order.totalInCents / 100).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}
    </DialogContent>
  )
}
