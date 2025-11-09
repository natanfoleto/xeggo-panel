import { useQuery } from '@tanstack/react-query'
import { Loader2, Pencil } from 'lucide-react'

import { getCoupon } from '@/api/coupons/get-coupon'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { CouponForm } from './coupon-form'
import { UpdateCouponSkeleton } from './update-coupon-skeleton'

interface UpdateCouponProps {
  couponId: string
}

export function UpdateCoupon({ couponId }: UpdateCouponProps) {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['coupon', couponId],
    queryFn: () => getCoupon({ couponId }),
    staleTime: 1000 * 60 * 15,
  })

  const coupon = data?.coupon

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="size-8" variant="outline">
          <Pencil />
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-11/12 sm:min-w-1/3">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isFetching ? (
              <>
                Carregando cupom
                <Loader2 className="text-muted-foreground size-4 animate-spin" />
              </>
            ) : (
              coupon?.code
            )}
          </DialogTitle>

          <DialogDescription>
            {coupon && `Atualize as informações do cupom ${coupon?.code}.`}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <UpdateCouponSkeleton />
        ) : (
          coupon && <CouponForm initialData={coupon} />
        )}
      </DialogContent>
    </Dialog>
  )
}
