import { api } from '@/lib/axios'

export interface UpdateCategoryRequest {
  categoryId: string
  name?: string
  description?: string | null
}

export async function updateCategory({
  categoryId,
  name,
  description,
}: UpdateCategoryRequest) {
  await api.auth.put(`/categories/${categoryId}`, { name, description })
}
