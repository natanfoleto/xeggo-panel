import { api } from '@/lib/axios'

export interface DeleteCategoryRequest {
  categoryId: string
}

export async function deleteCategory({ categoryId }: DeleteCategoryRequest) {
  const response = await api.auth.delete(`/categories/${categoryId}`)

  return response.data
}
