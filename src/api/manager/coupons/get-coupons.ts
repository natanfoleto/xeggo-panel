import { api } from '@/lib/axios'

export interface GetCouponsRequest {
  search?: string
  active?: boolean
  pageIndex?: number
}

export interface GetCouponsResponse {
  coupons: {
    id: string
    code: string
    type: 'percentage' | 'fixed'
    value: number
    minOrderInCents: number | null
    maxDiscountInCents: number | null
    expiresAt: string | null
    usageLimit: number | null
    usageCount: number
    active: boolean
    createdAt: string
  }[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
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
