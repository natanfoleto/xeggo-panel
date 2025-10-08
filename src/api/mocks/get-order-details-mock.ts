import { http, HttpResponse } from 'msw'

import type { GetOrderDetailsResponse } from '../orders/get-order-details'

export const getOrderDetailsMock = http.get('/orders/:orderId', async () => {
  return HttpResponse.json<GetOrderDetailsResponse>({
    id: 'custom-order-id',
    customer: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '47817292893',
    },
    status: 'pending',
    createdAt: new Date().toISOString(),
    orderItems: [
      {
        id: 'order-item-1',
        priceInCents: 3900,
        product: {
          name: 'Pepperoni Pizza',
        },
        quantity: 1,
        selectedComplements: [
          {
            id: 'complement-1',
            quantity: 1,
            priceInCents: 500,
            complement: {
              name: 'Extra Cheese',
            },
          },
          {
            id: 'complement-2',
            quantity: 1,
            priceInCents: 300,
            complement: {
              name: 'Bacon',
            },
          },
        ],
      },
      {
        id: 'order-item-2',
        priceInCents: 4900,
        product: {
          name: 'Chicken & Barbecue Pizza',
        },
        quantity: 2,
        selectedComplements: [
          {
            id: 'complement-3',
            quantity: 2,
            priceInCents: 400,
            complement: {
              name: 'Cheddar',
            },
          },
        ],
      },
    ],
    totalInCents: 3900 + 500 + 300 + (4900 + 400 * 2) * 2,
  })
})
