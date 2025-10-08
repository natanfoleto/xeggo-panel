import { api } from '@/lib/axios'

export interface CreateProductRequest {
  restaurantId: string
  name: string
  description?: string
  priceInCents: number
  categoryId: string
  active?: boolean
}

export interface CreateProductResponse {
  productId: string
}

export async function createProduct({
  restaurantId,
  name,
  description,
  priceInCents,
  categoryId,
  active,
}: CreateProductRequest) {
  const response = await api.post<CreateProductResponse>(
    `/restaurants/${restaurantId}/products`,
    { name, description, priceInCents, categoryId, active },
  )

  return response.data
}
