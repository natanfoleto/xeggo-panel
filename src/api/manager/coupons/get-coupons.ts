import type { PaginationResponse } from '@/dtos/pagination/pagination-response'
import { api } from '@/lib/axios'

export interface Coupon {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  expiresAt: string | null
  usageLimit: number | null
  usageCount: number
  active: boolean
}

export interface GetCouponsRequest {
  search?: string
  active?: boolean
  pageIndex?: number
}

export interface GetCouponsResponse {
  coupons: Coupon[]
  meta: PaginationResponse
}

export async function getCoupons({
  search,
  active,
  pageIndex,
}: GetCouponsRequest = {}) {
  const response = await api.manager.get<GetCouponsResponse>('/coupons', {
    params: {
      search,
      active,
      pageIndex: pageIndex ?? 0,
    },
  })

  return response.data
}
