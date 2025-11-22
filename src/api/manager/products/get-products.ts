import type { PaginationResponse } from '@/dtos/pagination/pagination-response'
import { api } from '@/lib/axios'

export interface Product {
  id: string
  name: string
  description: string | null
  priceInCents: number
  photoUrl: string | null
  active: boolean
  category: {
    id: string
    name: string
  }
}

export interface GetProductsRequest {
  pageIndex?: number
  productName?: string | null
  categoryId?: string | null
  active?: boolean | null
}

export interface GetProductsResponse {
  products: Product[]
  meta: PaginationResponse
}

export async function getProducts({
  pageIndex = 0,
  productName,
  categoryId,
  active,
}: GetProductsRequest) {
  const response = await api.manager.get<GetProductsResponse>(`/products`, {
    params: {
      pageIndex,
      productName,
      categoryId,
      active: active !== null ? String(active) : undefined,
    },
  })

  return response.data
}
