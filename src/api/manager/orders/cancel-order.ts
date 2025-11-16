import { api } from '@/lib/axios'

export interface CancelOrderRequest {
  orderId: string
  cancellationReason?: string | null
}

export async function cancelOrder({
  orderId,
  cancellationReason,
}: CancelOrderRequest) {
  await api.manager.patch(`/orders/${orderId}/cancel`, {
    cancellationReason,
  })
}
