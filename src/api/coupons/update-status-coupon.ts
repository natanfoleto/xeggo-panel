import { api } from '@/lib/axios'

export interface UpdateStatusCouponRequest {
  couponId: string
}

export async function updateStatusCoupon({
  couponId,
}: UpdateStatusCouponRequest) {
  await api.auth.patch(`/coupons/${couponId}/status`)
}
