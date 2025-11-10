import { api } from '@/lib/axios'

export interface DeleteProductImageRequest {
  productId: string
}

export async function deleteProductImage({
  productId,
}: DeleteProductImageRequest) {
  const response = await api.manager.delete(`/products/${productId}/image`)

  return response.data
}
