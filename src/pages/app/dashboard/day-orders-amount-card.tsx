import { useQuery } from '@tanstack/react-query'
import { Loader2, Utensils } from 'lucide-react'

import { getDayOrdersAmount } from '@/api/get-day-orders-amount'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { CardSkeleton } from './card-skeleton'

export function DayOrdersAmountCard() {
  const { data: dayOrdersAmount, isFetching: isLoadingDayOrdersAmount } =
    useQuery({
      queryKey: ['metrics', 'day-orders-amount'],
      queryFn: getDayOrdersAmount,
    })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Pedidos (dia)</CardTitle>
        {isLoadingDayOrdersAmount ? (
          <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
        ) : (
          <Utensils className="text-muted-foreground h-4 w-4" />
        )}
      </CardHeader>
      <CardContent className="space-y-1">
        {dayOrdersAmount ? (
          <>
            <span className="text-2xl font-bold">
              {dayOrdersAmount.amount.toLocaleString('pt-BR')}
            </span>
            <p className="text-muted-foreground text-xs">
              <span
                className={
                  dayOrdersAmount.diffFromYesterday > 0
                    ? 'text-emerald-500'
                    : 'text-red-500'
                }
              >
                {dayOrdersAmount.diffFromYesterday > 0
                  ? `+${dayOrdersAmount.diffFromYesterday}`
                  : dayOrdersAmount.diffFromYesterday}
                %
              </span>{' '}
              em relação a ontem
            </p>
          </>
        ) : (
          <CardSkeleton />
        )}
      </CardContent>
    </Card>
  )
}
