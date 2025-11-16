import { api } from '@/lib/axios'

export interface PopularProduct {
  product: string
  amount: number
  [key: string]: string | number
}

export interface GetPopularProductsResponse {
  products: PopularProduct[]
}

export async function getPopularProducts() {
  const response = await api.manager.get<GetPopularProductsResponse>(
    '/metrics/popular-products',
  )

  return response.data.products
}
