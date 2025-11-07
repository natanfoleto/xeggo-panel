import { api } from '@/lib/axios'

export interface CancelOrderParams {
  orderId: string
  cancellationReason?: string | null
}

export async function cancelOrder({
  orderId,
  cancellationReason,
}: CancelOrderParams) {
  await api.auth.patch(`/orders/${orderId}/cancel`, {
    cancellationReason,
  })
}
