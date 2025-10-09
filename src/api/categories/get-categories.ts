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
  meta: {
    pageIndex: number
    totalCount: number
    perPage: number
  }
}

export interface GetCategoriesQuery {
  pageIndex?: number
}

export async function getCategories({
  pageIndex = 0,
}: GetCategoriesQuery = {}) {
  const response = await api.get<GetCategoriesResponse>('/categories', {
    params: {
      pageIndex,
    },
  })

  return response.data
}
