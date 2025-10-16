import { api } from '@/lib/axios'

export interface DispatchOrderParams {
  orderId: string
}

export async function dispatchOrder({ orderId }: DispatchOrderParams) {
  await api.auth.patch(`/orders/${orderId}/dispatch`)
}
