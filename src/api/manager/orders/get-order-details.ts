import type { OrderStatus } from '@/dtos/orders/order-status'
import type { OrderType } from '@/dtos/orders/order-type'
import type { paymentType } from '@/dtos/orders/payment-type'
import type { PaymentMethod } from '@/dtos/payment-methods/payment-method'
import { api } from '@/lib/axios'

export interface GetOrderDetailsRequest {
  orderId: string
}

export interface OrderDetails {
  id: string
  createdAt: string
  status: OrderStatus
  orderType: OrderType
  totalInCents: number
  deliveryAddress: string | null
  paymentType: paymentType
  paymentMethod: PaymentMethod
  changeForInCents: number | null
  deliveryFeeInCents: number | null
  discountInCents: number | null
  couponCode: string | null
  observations: string | null
  estimatedDeliveryTime: number | null
  cancellationReason: string | null
  paidAt: string | null
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
