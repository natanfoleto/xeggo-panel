import { api } from '@/lib/axios'

export interface Plan {
  id: string
  name: string
  type: 'monthly' | 'annual'
  priceInCents: number
  stripePriceId: string
  active: boolean
  trialPeriodDays: number | null
  features: string[]
}

export interface GetPlansResponse {
  plans: Plan[]
}

export async function getPlans() {
  const response = await api.public.get<GetPlansResponse>('/plans')
  return response.data
}
