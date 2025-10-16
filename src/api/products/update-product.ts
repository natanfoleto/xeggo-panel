import { api } from '@/lib/axios'

export interface UpdateProductRequest {
  productId: string
  name?: string
  description?: string | null
  priceInCents?: number
  categoryId?: string
  active?: boolean
  ingredients?: {
    name: string
  }[]
  complementGroups?: {
    name: string
    mandatory: boolean
    min: number
    max: number
    complements: {
      name: string
      priceInCents?: number | null
      description?: string | null
    }[]
  }[]
}

export async function updateProduct({
  productId,
  name,
  description,
  priceInCents,
  categoryId,
  active,
  ingredients,
  complementGroups,
}: UpdateProductRequest) {
  await api.auth.put(`/products/${productId}`, {
    name,
    description,
    priceInCents,
    categoryId,
    active,
    ingredients,
    complementGroups,
  })
}
