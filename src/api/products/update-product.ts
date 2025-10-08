import { api } from '@/lib/axios'

export interface UpdateProductRequest {
  productId: string
  name?: string
  description?: string
  priceInCents?: number
  categoryId?: string
  active?: boolean
}

export async function updateProduct({
  productId,
  name,
  description,
  priceInCents,
  categoryId,
  active,
}: UpdateProductRequest) {
  await api.put(`/products/${productId}`, {
    name,
    description,
    priceInCents,
    categoryId,
    active,
  })
}
