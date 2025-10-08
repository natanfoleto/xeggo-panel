import { api } from '@/lib/axios'

export interface DeleteCategoryRequest {
  categoryId: string
}

export async function deleteCategory({ categoryId }: DeleteCategoryRequest) {
  await api.delete(`/categories/${categoryId}`)
}
