import { api } from '@/lib/axios'

export interface DeleteProductRequest {
  productId: string
}

export async function deleteProduct({ productId }: DeleteProductRequest) {
  await api.delete(`/products/${productId}`)
}
