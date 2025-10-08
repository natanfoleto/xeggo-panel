import { http, HttpResponse } from 'msw'

import type { GetMonthCanceledOrdersAmountResponse } from '../metrics/get-month-canceled-orders-amount'

export const getMonthCanceledOrdersAmountMock = http.get<
  never,
  never,
  GetMonthCanceledOrdersAmountResponse
>('/metrics/month-canceled-orders-amount', async () => {
  return HttpResponse.json({
    amount: 50,
    diffFromLastMonth: -10,
  })
})
