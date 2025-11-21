import { cn } from '@/lib/utils'

type OrderStatus =
  | 'awaiting_payment'
  | 'payment_failed'
  | 'payment_confirmed'
  | 'payment_overdue'
  | 'payment_refunded'
  | 'chargeback_requested'
  | 'pending'
  | 'processing'
  | 'delivering'
  | 'delivered'
  | 'canceled'

const orderStatusMap: Record<OrderStatus, string> = {
  awaiting_payment: 'Aguardando pagamento',
  payment_failed: 'Pagamento falhou',
  payment_confirmed: 'Pagamento confirmado',
  payment_overdue: 'Pagamento expirado',
  payment_refunded: 'Pagamento reembolsado',
  chargeback_requested: 'Estorno solicitado',
  pending: 'Pendente',
  canceled: 'Cancelado',
  processing: 'Em preparo',
  delivering: 'Em entrega',
  delivered: 'Entregue',
}

interface OrderStatusProps {
  status: OrderStatus
  className?: string
}

export function OrderStatus({ status, className }: OrderStatusProps) {
  return (
    <div
      className={cn('text-muted-foreground flex items-center gap-2', className)}
    >
      {['pending', 'awaiting_payment'].includes(status) && (
        <span className="size-2 rounded-full bg-yellow-400" />
      )}

      {['payment_confirmed', 'delivered'].includes(status) && (
        <span className="size-2 rounded-full bg-green-500" />
      )}

      {['payment_refunded', 'processing'].includes(status) && (
        <span className="size-2 rounded-full bg-blue-500" />
      )}

      {['delivering'].includes(status) && (
        <span className="size-2 rounded-full bg-indigo-500" />
      )}

      {['canceled'].includes(status) && (
        <span className="size-2 rounded-full bg-gray-500" />
      )}

      {['payment_failed'].includes(status) && (
        <span className="size-2 rounded-full bg-red-500" />
      )}

      {['payment_overdue'].includes(status) && (
        <span className="size-2 rounded-full bg-orange-500" />
      )}

      {['chargeback_requested'].includes(status) && (
        <span className="size-2 rounded-full bg-violet-500" />
      )}

      <span className="font-medium">{orderStatusMap[status]}</span>
    </div>
  )
}
