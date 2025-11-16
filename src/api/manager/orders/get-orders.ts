import { api } from '@/lib/axios'

export interface GetOrdersRequest {
  pageIndex?: number | null
  customerName?: string | null
  orderId?: string | null
  status?: string | null
  from?: string | null
  to?: string | null
}

export interface GetOrdersResponse {
  orders: {
    orderId: string
    createdAt: string
    customerName: string
    totalItemsQuantity: number
    total: number
    status: 'pending' | 'canceled' | 'processing' | 'delivering' | 'delivered'
  }[]
  meta: {
    pageIndex: number
    totalCount: number
    perPage: number
  }
}

export async function getOrders({
  pageIndex,
  customerName,
  orderId,
  status,
  from,
  to,
}: GetOrdersRequest) {
  const response = await api.manager.get<GetOrdersResponse>('/orders', {
    params: {
      pageIndex,
      customerName,
      orderId,
      status,
      from,
      to,
    },
  })

  return response.data
}
