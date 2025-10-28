// src/api/coupons/create-coupon.ts
import { api } from '@/lib/axios'

export interface CreateCouponRequest {
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minOrderInCents?: number | null
  maxDiscountInCents?: number | null
  expiresAt?: string | null
  usageLimit?: number | null
  active: boolean
}

export interface CreateCouponResponse {
  couponId: string
}

export async function createCoupon({
  code,
  type,
  value,
  minOrderInCents,
  maxDiscountInCents,
  expiresAt,
  usageLimit,
  active,
}: CreateCouponRequest) {
  const response = await api.auth.post<CreateCouponResponse>(`/coupons`, {
    code,
    type,
    value,
    minOrderInCents,
    maxDiscountInCents,
    expiresAt,
    usageLimit,
    active,
  })

  return response.data
}
