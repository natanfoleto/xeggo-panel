import { api } from '@/lib/axios'

export interface ResetOrderParams {
  orderId: string
}

export async function resetOrder({ orderId }: ResetOrderParams) {
  await api.auth.patch(`/orders/${orderId}/reset`)
}
