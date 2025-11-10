import { api } from '@/lib/axios'

export interface UpdateCouponRequest {
  couponId: string
  code?: string
  type?: 'percentage' | 'fixed'
  value?: number
  minOrderInCents?: number | null
  maxDiscountInCents?: number | null
  expiresAt?: string | null
  usageLimit?: number | null
  active?: boolean
}

export async function updateCoupon({
  couponId,
  code,
  type,
  value,
  minOrderInCents,
  maxDiscountInCents,
  expiresAt,
  usageLimit,
  active,
}: UpdateCouponRequest) {
  await api.manager.put(`/coupons/${couponId}`, {
    code,
    type,
    value,
    minOrderInCents,
    maxDiscountInCents,
    expiresAt,
    usageLimit,
    active,
  })
}
