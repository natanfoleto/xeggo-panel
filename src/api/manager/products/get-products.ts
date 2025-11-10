import { api } from '@/lib/axios'

export interface GetProductsRequest {
  pageIndex?: number
  productName?: string | null
  categoryId?: string | null
  active?: boolean | null
}

export interface Product {
  id: string
  name: string
  description: string | null
  priceInCents: number
  photoUrl: string | null
  active: boolean
  categoryId: string
  restaurantId: string
  createdAt: string
  updatedAt: string
  category: {
    id: string
    name: string
  }
}

export interface GetProductsResponse {
  products: Product[]
  meta: {
    pageIndex: number
    totalCount: number
    perPage: number
  }
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
