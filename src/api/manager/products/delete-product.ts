import { api } from '@/lib/axios'

export interface DeleteProductParams {
  productId: string
}

export async function deleteProduct({ productId }: DeleteProductParams) {
  await api.manager.delete(`/products/${productId}`)
}
