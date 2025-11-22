import { api } from '@/lib/axios'

export interface DailyReceipts {
  date: string
  receipt: number
}

export interface GetDailyReceiptInPeriodRequest {
  from?: string
  to?: string
}

export interface GetDailyReceiptInPeriodResponse {
  dailyReceipts: DailyReceipts[]
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
