import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { TableCell, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/utils/format-currency'

import { DeleteCoupon } from './delete-coupon'
import { UpdateCoupon } from './update-coupon'
import { UpdateStatusCoupon } from './update-status-coupon'

export interface CouponTableRowProps {
  coupon: {
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
  }
}

export function CouponTableRow({ coupon }: CouponTableRowProps) {
  const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date()

  const isExhausted =
    coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit

  return (
    <TableRow>
      <TableCell className="font-mono font-medium">{coupon.code}</TableCell>

      <TableCell>
        {coupon.type === 'percentage' ? 'Porcentagem' : 'Valor fixo'}
      </TableCell>

      <TableCell className="text-center">
        {coupon.type === 'percentage'
          ? `${coupon.value}%`
          : formatCurrency(coupon.value / 100)}
      </TableCell>

      <TableCell
        className={`text-center ${isExhausted ? 'font-medium text-red-600' : ''}`}
      >
        {coupon.usageCount}
        {coupon.usageLimit ? `/${coupon.usageLimit}` : '/∞'}
      </TableCell>

      <TableCell className="text-muted-foreground text-sm">
        {isExpired ? (
          <span className="font-medium text-red-600">
            Expirado em{' '}
            {format(new Date(coupon.expiresAt!), 'dd/MM/yyyy', {
              locale: ptBR,
            })}
          </span>
        ) : coupon.expiresAt ? (
          format(new Date(coupon.expiresAt), "dd/MM/yyyy 'às' HH:mm", {
            locale: ptBR,
          })
        ) : (
          'Sem validade'
        )}
      </TableCell>

      <TableCell>
        <UpdateStatusCoupon
          couponId={coupon.id}
          couponCode={coupon.code}
          currentStatus={coupon.active}
        />
      </TableCell>

      <TableCell className="text-muted-foreground flex gap-2">
        <UpdateCoupon couponId={coupon.id} />
        <DeleteCoupon couponId={coupon.id} couponCode={coupon.code} />
      </TableCell>
    </TableRow>
  )
}
