import { api } from '@/lib/axios'

export interface CreateCategoryRequest {
  name: string
  description?: string
}

export interface CreateCategoryResponse {
  categoryId: string
}

export async function createCategory({
  name,
  description,
}: CreateCategoryRequest) {
  const response = await api.post<CreateCategoryResponse>(`/categories`, {
    name,
    description,
  })

  return response.data
}
