import { api } from '@/lib/axios'

import type { PaymentMethod } from './get-payment-methods'

export interface UpdatePaymentMethodsBody {
  paymentMethods: {
    selectedMethods: PaymentMethod[]
  }
}

export async function updatePaymentMethods(body: UpdatePaymentMethodsBody) {
  const response = await api.put('/payment-methods', body)

  return response.data
}
