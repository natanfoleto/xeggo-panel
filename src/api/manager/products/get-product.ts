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
  restaurantId: string
  createdAt: string
  updatedAt: string
  category: {
    id: string
    name: string
    description: string | null
  }
  ingredients: {
    id: string
    name: string
    productId: string
    createdAt: string
    updatedAt: string
  }[]
  complementGroups: {
    id: string
    name: string
    mandatory: boolean
    min: number
    max: number
    productId: string
    createdAt: string
    updatedAt: string
    complements: {
      id: string
      name: string
      priceInCents: number | null
      description: string | null
      complementGroupId: string
      createdAt: string
      updatedAt: string
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
