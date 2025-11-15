import { api } from '@/lib/axios'

interface CheckoutMetadata {
  userId: string
  restaurantId?: string
  email?: string
}

export interface CreateCheckoutRequest {
  planId: string
  metadata: CheckoutMetadata
}

export interface CreateCheckoutResponse {
  sessionId: string
  url: string
}

export async function createCheckout({
  planId,
  metadata,
}: CreateCheckoutRequest): Promise<CreateCheckoutResponse> {
  const response = await api.manager.post<CreateCheckoutResponse>(
    '/stripe/checkout',
    {
      planId,
      metadata,
    },
  )

  return response.data
}
