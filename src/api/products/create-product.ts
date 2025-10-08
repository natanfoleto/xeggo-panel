import { api } from '@/lib/axios'

export interface CreateProductRequest {
  name: string
  description?: string | null
  priceInCents: number
  categoryId: string
  active?: boolean
  ingredients?: {
    name: string
  }[]
  complementGroups?: {
    name: string
    mandatory?: boolean
    min?: number
    max?: number
    complements: {
      name: string
      priceInCents?: number | null
      description?: string | null
    }[]
  }[]
}

export interface CreateProductResponse {
  productId: string
}

export async function createProduct({
  name,
  description,
  priceInCents,
  categoryId,
  active,
  ingredients,
  complementGroups,
}: CreateProductRequest) {
  const response = await api.post<CreateProductResponse>(`/products`, {
    name,
    description,
    priceInCents,
    categoryId,
    active,
    ingredients,
    complementGroups,
  })

  return response.data
}
