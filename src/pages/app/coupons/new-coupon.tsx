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

export function NewCoupon() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Novo cupom</Button>
      </DialogTrigger>

      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Novo cupom</DialogTitle>
          <DialogDescription>
            Adicione um novo cupom de desconto.
          </DialogDescription>
        </DialogHeader>

        <CouponForm />
      </DialogContent>
    </Dialog>
  )
}
