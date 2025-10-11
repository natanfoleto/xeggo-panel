import { api } from '@/lib/axios'

export type PaymentMethod =
  | 'cash'
  | 'creditCard'
  | 'debitCard'
  | 'pix'
  | 'voucher'
  | 'bankTransfer'

export interface GetPaymentMethodsResponse {
  paymentMethods: PaymentMethod[]
}

export async function getPaymentMethods() {
  const response = await api.get<GetPaymentMethodsResponse>('/payment-methods')

  return response.data
}
