import { api } from '@/lib/axios'

export interface GetCategoriesRequest {
  restaurantId: string
}

export interface Category {
  id: string
  name: string
  description: string | null
  restaurantId: string
  createdAt: Date
  updatedAt: Date
  _count: {
    products: number
  }
}

export interface GetCategoriesResponse {
  categories: Category[]
}

export async function getCategories({ restaurantId }: GetCategoriesRequest) {
  const response = await api.get<GetCategoriesResponse>(
    `/restaurants/${restaurantId}/categories`,
  )

  return response.data
}
