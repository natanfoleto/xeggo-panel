import type { PlanType } from '@/dtos/plans/plan-type'
import { api } from '@/lib/axios'

export interface Plan {
  id: string
  name: string
  type: PlanType
  priceInCents: number
  features: string[]
}

export interface GetPlansResponse {
  plans: Plan[]
}

export async function getPlans() {
  const response = await api.public.get<GetPlansResponse>('/plans')

  return response.data.plans
}
