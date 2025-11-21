import { useQuery } from '@tanstack/react-query'
import { DollarSign, Loader2 } from 'lucide-react'

import { getMonthReceipt } from '@/api/manager/metrics/get-month-receipt'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/utils/format-currency'

import { CardSkeleton } from './card-skeleton'

export function MonthReceiptCard() {
  const { data: monthReceipt, isFetching: isLoadingMonthReceipt } = useQuery({
    queryKey: ['metrics', 'month-receipt'],
    queryFn: getMonthReceipt,
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Receita total (mês)
        </CardTitle>
        {isLoadingMonthReceipt ? (
          <Loader2 className="text-muted-foreground size-4 animate-spin" />
        ) : (
          <DollarSign className="text-muted-foreground size-4" />
        )}
      </CardHeader>

      <CardContent className="space-y-1">
        {monthReceipt ? (
          <>
            <span className="text-2xl font-bold">
              {formatCurrency(monthReceipt.receipt / 100)}
            </span>
            <p className="text-muted-foreground text-xs">
              <span
                className={
                  monthReceipt.diffFromLastMonth > 0
                    ? 'text-emerald-500'
                    : 'text-red-500'
                }
              >
                {monthReceipt.diffFromLastMonth > 0
                  ? `+${monthReceipt.diffFromLastMonth}`
                  : monthReceipt.diffFromLastMonth}
                %
              </span>{' '}
              em relação ao mês passado
            </p>
          </>
        ) : (
          <CardSkeleton />
        )}
      </CardContent>
    </Card>
  )
}
