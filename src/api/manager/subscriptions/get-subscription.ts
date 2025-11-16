import { api } from '@/lib/axios'

export interface Subscription {
  id: string
  restaurantId: string
  status:
    | 'trialing'
    | 'active'
    | 'past_due'
    | 'canceled'
    | 'incomplete'
    | 'incomplete_expired'
    | 'unpaid'
    | 'paused'
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  stripePriceId: string | null
  cardBrand: string | null
  cardLast4: string | null
  cardExpMonth: number | null
  cardExpYear: number | null
  currentPeriodStart: string
  currentPeriodEnd: string
  trialStart: string | null
  trialEnd: string | null
  canceledAt: string | null
  cancelAt: string | null
  cancelAtPeriodEnd: boolean
  createdAt: string
  updatedAt: string
  plan: {
    id: string
    name: string
    type: 'monthly' | 'annual'
    priceInCents: number
    trialPeriodDays: number | null
    features: string[]
  }
}

export interface GetSubscriptionResponse {
  subscription: Subscription
}

export async function getSubscription() {
  const response =
    await api.manager.get<GetSubscriptionResponse>('/subscriptions/me')

  return response.data.subscription
}
