import { api } from '@/lib/axios'

export interface GetOrderDetailsRequest {
  orderId: string
}

export interface OrderDetails {
  id: string
  createdAt: string
  status: 'pending' | 'canceled' | 'processing' | 'delivering' | 'delivered'
  orderType: 'delivery' | 'pickup'
  totalInCents: number
  deliveryAddress: string | null
  paymentMethods: string[]
  changeForInCents: number | null
  deliveryFeeInCents: number | null
  discountInCents: number | null
  couponCode: string | null
  observations: string | null
  estimatedDeliveryTime: number | null
  cancellationReason: string | null
  customer: {
    name: string
    email: string
    phone: string | null
  }
  orderItems: {
    id: string
    priceInCents: number
    quantity: number
    observations: string | null
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
}

export interface GetOrderDetailsResponse {
  order: OrderDetails
}

export async function getOrderDetails({ orderId }: GetOrderDetailsRequest) {
  const response = await api.manager.get<GetOrderDetailsResponse>(
    `/orders/${orderId}`,
  )

  return response.data.order
}
