import { api } from '@/lib/axios'

export interface CreateCategoryRequest {
  restaurantId: string
  name: string
  description?: string
}

export interface CreateCategoryResponse {
  categoryId: string
}

export async function createCategory({
  restaurantId,
  name,
  description,
}: CreateCategoryRequest) {
  const response = await api.post<CreateCategoryResponse>(
    `/restaurants/${restaurantId}/categories`,
    { name, description },
  )

  return response.data
}
