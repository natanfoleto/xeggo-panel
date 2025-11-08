import { cn } from '@/lib/utils'

type OrderStatus =
  | 'pending'
  | 'canceled'
  | 'processing'
  | 'delivering'
  | 'delivered'

interface OrderStatusProps {
  status: OrderStatus
  className?: string
}

const orderStatusMap: Record<OrderStatus, string> = {
  pending: 'Pendente',
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
      {['pending'].includes(status) && (
        <span className="size-2 rounded-full bg-slate-400" />
      )}

      {['canceled'].includes(status) && (
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
