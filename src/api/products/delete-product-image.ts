import { api } from '@/lib/axios'

export interface DeleteProductImageRequest {
  productId: string
}

export async function deleteProductImage({
  productId,
}: DeleteProductImageRequest) {
  await api.delete(`/products/${productId}/image`)
}
