import { api } from '@/lib/axios'

export interface GetOrderDetailsParams {
  orderId: string
}

export interface GetOrderDetailsResponse {
  id: string
  createdAt: string
  totalInCents: number
  deliveryAddress: string
  paymentMethods: string[]
  customer: {
    name: string
    email: string
    phone: string | null
  }
  orderItems: {
    id: string
    priceInCents: number
    quantity: number
    product: {
      name: string
    } | null
    selectedComplements: {
      id: string
      quantity: number
      priceInCents: number
      complement: {
        name: string
      }
    }[]
  }[]
  status: 'pending' | 'canceled' | 'processing' | 'delivering' | 'delivered'
}

export async function getOrderDetails({ orderId }: GetOrderDetailsParams) {
  const response = await api.auth.get<GetOrderDetailsResponse>(
    `/orders/${orderId}`,
  )

  return response.data
}
