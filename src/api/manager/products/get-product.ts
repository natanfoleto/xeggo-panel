import { api } from '@/lib/axios'

export interface GetProductRequest {
  productId: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  priceInCents: number
  photoUrl: string | null
  active: boolean
  categoryId: string
  ingredients: {
    id: string
    name: string
  }[]
  complementGroups: {
    id: string
    name: string
    mandatory: boolean
    min: number
    max: number
    complements: {
      id: string
      name: string
      priceInCents: number | null
      description: string | null
    }[]
  }[]
}

export interface GetProductResponse {
  product: Product
}

export async function getProduct({ productId }: GetProductRequest) {
  const response = await api.manager.get<GetProductResponse>(
    `/products/${productId}`,
  )

  return response.data.product
}
