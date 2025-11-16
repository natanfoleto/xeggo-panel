import { api } from '@/lib/axios'

export interface GetDailyReceiptInPeriodRequest {
  from?: string
  to?: string
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
}: GetDailyReceiptInPeriodRequest) {
  const response = await api.manager.get<GetDailyReceiptInPeriodResponse>(
    '/metrics/daily-receipt-in-period',
    {
      params: {
        from,
        to,
      },
    },
  )

  return response.data.dailyReceipts
}
