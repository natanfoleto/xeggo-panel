import { api } from '@/lib/axios'

export interface Coupon {
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
}

export interface GetCouponRequest {
  couponId: string
}

export interface GetCouponResponse {
  coupon: Coupon
}

export async function getCoupon({ couponId }: GetCouponRequest) {
  const response = await api.manager.get<GetCouponResponse>(
    `/coupons/${couponId}`,
  )

  return response.data.coupon
}
