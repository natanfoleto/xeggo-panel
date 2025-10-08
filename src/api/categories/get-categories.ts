import { api } from '@/lib/axios'

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

export async function getCategories() {
  const response = await api.get<GetCategoriesResponse>(`/categories`)

  return response.data
}
