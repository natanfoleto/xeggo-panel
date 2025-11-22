import type { PlanType } from '@/dtos/plans/plan-type'
import type { SubscriptionStatus } from '@/dtos/subscriptions/subscription-status'
import { api } from '@/lib/axios'

export interface Subscription {
  id: string
  status: SubscriptionStatus
  stripeCustomerId: string | null
  cardBrand: string | null
  cardLast4: string | null
  cardExpMonth: number | null
  cardExpYear: number | null
  currentPeriodEnd: string
  trialEnd: string | null
  canceledAt: string | null
  cancelAt: string | null
  updatedAt: string
  plan: {
    name: string
    type: PlanType
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
