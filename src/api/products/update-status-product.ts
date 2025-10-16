import { api } from '@/lib/axios'

export interface UpdateStatusProductRequest {
  productId: string
}

export async function updateStatusProduct({
  productId,
}: UpdateStatusProductRequest) {
  await api.auth.patch(`/products/${productId}/status`)
}
