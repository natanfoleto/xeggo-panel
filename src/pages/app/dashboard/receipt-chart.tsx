import { useQuery } from '@tanstack/react-query'
import { subDays } from 'date-fns'
import { Loader2, XCircle } from 'lucide-react'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import colors from 'tailwindcss/colors'

import { getDailyReceiptInPeriod } from '@/api/manager/metrics/get-daily-receipt-in-period'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/utils/format-currency'

interface ReceiptDataPerMonth {
  date: string
  receipt: number
}

export interface ReceiptChartProps {
  data: ReceiptDataPerMonth[]
}

interface CustomTooltipProps {
  active?: boolean
  label?: string
  payload?: {
    name?: string
    value?: number
  }[]
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const value = payload[0].value

    return (
      <div className="bg-card text-card-foreground flex gap-1 rounded-l border p-2 text-sm shadow-sm">
        <span className="font-semibold">{label}</span>
        <span>-</span>
        <span>{value ? formatCurrency(value / 100) : 0}</span>
      </div>
    )
  }

  return null
}

export function ReceiptChart() {
  const [period, setPeriod] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })

  const {
    data: dailyReceipts,
    isFetching: isLoadingDailyReceiptInPeriod,
    error: dailyReceiptError,
  } = useQuery({
    retry: false,
    queryKey: ['metrics', 'daily-receipt-in-period', period],
    queryFn: () =>
      getDailyReceiptInPeriod({
        from: period?.from?.toISOString(),
        to: period?.to?.toISOString(),
      }),
  })

  function handleResetPeriod() {
    setPeriod({
      from: subDays(new Date(), 7),
      to: new Date(),
    })
  }

  return (
    <Card className="col-span-8">
      <CardHeader className="flex flex-col items-center justify-between gap-4 pb-8 sm:flex-row">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            Receita no período
            {isLoadingDailyReceiptInPeriod && (
              <Loader2 className="text-muted-foreground size-4 animate-spin" />
            )}
          </CardTitle>
          <CardDescription>Receita diária no período</CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Label>Período</Label>
          <DateRangePicker date={period} onDateChange={setPeriod} />
        </div>
      </CardHeader>

      <CardContent>
        {dailyReceipts ? (
          <>
            {dailyReceipts.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={dailyReceipts} style={{ fontSize: 12 }}>
                  <XAxis
                    dataKey="date"
                    stroke="#888888"
                    tickLine={false}
                    axisLine={false}
                    dy={16}
                  />

                  <YAxis
                    stroke="#888888"
                    tickLine={false}
                    axisLine={false}
                    width={80}
                    tickFormatter={(value: number) =>
                      formatCurrency(value / 100)
                    }
                  />

                  <CartesianGrid className="stroke-muted!" vertical={false} />

                  <Line
                    type="linear"
                    strokeWidth={2}
                    dataKey="receipt"
                    stroke={colors.violet[500]}
                  />

                  <Tooltip cursor={false} content={<CustomTooltip />} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-60 w-full flex-col items-center justify-center gap-0.5">
                <span className="text-muted-foreground text-sm">
                  Nenhum resultado encontrado para o período.
                </span>

                <Button
                  variant="link"
                  size="xs"
                  className="text-violet-500 dark:text-violet-400"
                  onClick={handleResetPeriod}
                >
                  Exibir resultados dos últimos 7 dias
                </Button>
              </div>
            )}
          </>
        ) : dailyReceiptError ? (
          <div className="flex h-60 w-full flex-col items-center justify-center gap-0.5">
            <span className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400">
              <XCircle className="h-4 w-4" />
              Erro ao obter dados do período.
            </span>

            <Button
              variant="link"
              size="xs"
              className="text-violet-500 dark:text-violet-400"
              onClick={handleResetPeriod}
            >
              Recarregar gráfico
            </Button>
          </div>
        ) : (
          <div className="flex h-60 w-full items-center justify-center">
            <Loader2 className="text-muted-foreground size-8 animate-spin" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
