import { api } from '@/lib/axios'

export interface GetDailyReceiptInPeriodQuery {
  from?: Date
  to?: Date
}

export interface GetDailyReceiptInPeriodResponse {
  dailyReceipts: Array<{
    date: string
    receipt: number
  }>
}

export async function getDailyReceiptInPeriod({
  from,
  to,
}: GetDailyReceiptInPeriodQuery) {
  const response = await api.manager.get<GetDailyReceiptInPeriodResponse>(
    '/metrics/daily-receipt-in-period',
    {
      params: {
        from,
        to,
      },
    },
  )

  return response.data
}
