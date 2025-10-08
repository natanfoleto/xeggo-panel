import { useQuery } from '@tanstack/react-query'
import { Loader2, Utensils } from 'lucide-react'

import { getMonthOrdersAmount } from '@/api/metrics/get-month-orders-amount'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { CardSkeleton } from './card-skeleton'

export function MonthOrdersAmountCard() {
  const { data: monthOrdersAmount, isFetching: isLoadingMonthOrdersAmount } =
    useQuery({
      queryKey: ['metrics', 'month-orders-amount'],
      queryFn: getMonthOrdersAmount,
    })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Pedidos (mês)</CardTitle>
        {isLoadingMonthOrdersAmount ? (
          <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
        ) : (
          <Utensils className="text-muted-foreground h-4 w-4" />
        )}
      </CardHeader>
      <CardContent className="space-y-1">
        {monthOrdersAmount ? (
          <>
            <span className="text-2xl font-bold">
              {monthOrdersAmount.amount.toLocaleString('pt-BR')}
            </span>
            <p className="text-muted-foreground text-xs">
              <span
                className={
                  monthOrdersAmount.diffFromLastMonth > 0
                    ? 'text-emerald-500'
                    : 'text-red-500'
                }
              >
                {monthOrdersAmount.diffFromLastMonth > 0
                  ? `+${monthOrdersAmount.diffFromLastMonth}`
                  : monthOrdersAmount.diffFromLastMonth}
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
