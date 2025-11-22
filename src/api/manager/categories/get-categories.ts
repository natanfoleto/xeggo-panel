import type { PaginationResponse } from '@/dtos/pagination/pagination-response'
import { api } from '@/lib/axios'

export interface Category {
  id: string
  name: string
  description: string | null
}

export interface GetCategoriesResponse {
  categories: Category[]
  meta: PaginationResponse
}

export interface GetCategoriesQuery {
  pageIndex?: number
  categoryName?: string | null
}

export async function getCategories({
  pageIndex = 0,
  categoryName,
}: GetCategoriesQuery = {}) {
  const response = await api.manager.get<GetCategoriesResponse>('/categories', {
    params: {
      pageIndex,
      categoryName,
    },
  })

  return response.data
}
