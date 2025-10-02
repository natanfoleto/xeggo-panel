import { http, HttpResponse } from 'msw'

import type { DispatchOrderParams } from '../dispatch-order'

export const dispatchOrderMock = http.put<DispatchOrderParams>(
  '/orders/:orderId/dispatch',
  async ({ params }) => {
    const { orderId } = params

    if (orderId === 'error-order-id') {
      return new HttpResponse(null, { status: 400 })
    } else {
      return new HttpResponse(null, { status: 204 })
    }
  },
)
