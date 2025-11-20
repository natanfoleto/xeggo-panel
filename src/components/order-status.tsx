import { cn } from '@/lib/utils'

type OrderStatus =
  | 'pending'
  | 'awaiting_payment'
  | 'payment_failed'
  | 'payment_confirmed'
  | 'processing'
  | 'delivering'
  | 'delivered'
  | 'canceled'

interface OrderStatusProps {
  status: OrderStatus
  className?: string
}

const orderStatusMap: Record<OrderStatus, string> = {
  pending: 'Pendente',
  awaiting_payment: 'Aguardando pagamento',
  payment_failed: 'Pagamento falhou',
  payment_confirmed: 'Pagamento confirmado',
  canceled: 'Cancelado',
  processing: 'Em preparo',
  delivering: 'Em entrega',
  delivered: 'Entregue',
}

export function OrderStatus({ status, className }: OrderStatusProps) {
  return (
    <div
      className={cn('text-muted-foreground flex items-center gap-2', className)}
    >
      {['pending', 'awaiting_payment'].includes(status) && (
        <span className="size-2 rounded-full bg-slate-400" />
      )}

      {['payment_confirmed'].includes(status) && (
        <span className="size-2 rounded-full bg-blue-400" />
      )}

      {['canceled', 'payment_failed'].includes(status) && (
        <span className="size-2 rounded-full bg-rose-500" />
      )}

      {['processing', 'delivering'].includes(status) && (
        <span className="size-2 rounded-full bg-amber-500" />
      )}

      {['delivered'].includes(status) && (
        <span className="size-2 rounded-full bg-emerald-500" />
      )}

      <span className="font-medium">{orderStatusMap[status]}</span>
    </div>
  )
}
