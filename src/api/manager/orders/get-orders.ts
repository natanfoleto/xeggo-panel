import type { OrderStatus } from '@/dtos/orders/order-status'
import type { PaginationResponse } from '@/dtos/pagination/pagination-response'
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
    status: OrderStatus
  }[]
  meta: PaginationResponse
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
