import { api } from '@/lib/axios'

export interface UpdateStatusProductRequest {
  productId: string
}

export async function updateStatusProduct({
  productId,
}: UpdateStatusProductRequest) {
  await api.patch(`/products/${productId}/status`)
}
