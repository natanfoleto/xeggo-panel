import { api } from '@/lib/axios'

import type { PaymentMethod } from './get-payment-methods'

export interface UpdatePaymentMethodsRequest {
  paymentMethods: {
    selectedMethods: PaymentMethod[]
  }
}

export async function updatePaymentMethods({
  paymentMethods,
}: UpdatePaymentMethodsRequest) {
  const response = await api.manager.put('/payment-methods', { paymentMethods })

  return response.data
}
