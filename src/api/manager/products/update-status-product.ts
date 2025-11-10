import { api } from '@/lib/axios'

export interface UpdateStatusProductRequest {
  productId: string
}

export async function updateStatusProduct({
  productId,
}: UpdateStatusProductRequest) {
  await api.manager.patch(`/products/${productId}/status`)
}
