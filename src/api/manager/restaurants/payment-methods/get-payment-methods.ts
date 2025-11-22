import type { PaymentMethod } from '@/dtos/payment-methods/payment-method'
import { api } from '@/lib/axios'

export interface GetPaymentMethodsResponse {
  paymentMethods: PaymentMethod[]
}

export async function getPaymentMethods() {
  const response =
    await api.manager.get<GetPaymentMethodsResponse>('/payment-methods')

  return response.data.paymentMethods
}
