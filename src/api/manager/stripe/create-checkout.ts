import { api } from '@/lib/axios'

interface CheckoutMetadata {
  userId: string
  restaurantId?: string
  email?: string
}

export interface CreateCheckoutRequest {
  plan: 'monthly' | 'annual'
  metadata: CheckoutMetadata
}

export interface CreateCheckoutResponse {
  sessionId: string
  url: string
}

export async function createCheckout({
  plan,
  metadata,
}: CreateCheckoutRequest): Promise<CreateCheckoutResponse> {
  const response = await api.manager.post<CreateCheckoutResponse>(
    '/stripe/checkout',
    {
      plan,
      metadata,
    },
  )

  return response.data
}
