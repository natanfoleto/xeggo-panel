import { api } from '@/lib/axios'

export interface DeleteCouponRequest {
  couponId: string
}

export async function deleteCoupon({ couponId }: DeleteCouponRequest) {
  await api.manager.delete(`/coupons/${couponId}`)
}
