import { api } from '@/lib/axios'

export interface GetCategoryRequest {
  categoryId: string
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

export interface GetCategoryResponse {
  category: Category
}

export async function getCategory({ categoryId }: GetCategoryRequest) {
  const response = await api.manager.get<GetCategoryResponse>(
    `/categories/${categoryId}`,
  )

  return response.data
}
