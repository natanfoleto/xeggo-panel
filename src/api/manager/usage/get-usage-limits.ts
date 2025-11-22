import type { PlanType } from '@/dtos/plans/plan-type'
import { api } from '@/lib/axios'

export interface UsageLimit {
  key: string
  limit: number
  current: number
  percentage: number
  unlimited: boolean
}

export interface GetUsageLimitsResponse {
  limits: UsageLimit[]
  plan: {
    name: string
    type: PlanType
  }
}

export async function getUsageLimits() {
  const response =
    await api.manager.get<GetUsageLimitsResponse>('/usage/limits')

  return response.data
}
