import { api } from '@/lib/axios'

export interface CreateCategoryRequest {
  name: string
  description?: string | null
}

export interface CreateCategoryResponse {
  categoryId: string
}

export async function createCategory({
  name,
  description,
}: CreateCategoryRequest) {
  const response = await api.manager.post<CreateCategoryResponse>(
    `/categories`,
    {
      name,
      description,
    },
  )

  return response.data
}
