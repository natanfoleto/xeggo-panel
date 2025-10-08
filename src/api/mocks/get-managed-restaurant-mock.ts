import { http, HttpResponse } from 'msw'

import type { GetManagedRestaurantResponse } from '../restaurants/get-managed-restaurant'

export const getManagedRestaurantMock = http.get<
  never,
  never,
  GetManagedRestaurantResponse
>('/managed-restaurant', async () => {
  return HttpResponse.json({
    id: 'custom-restaurant-id',
    name: 'Xeggo',
    description: 'Custom restaurant description',
    managerId: 'custom-user-id',
    createdAt: new Date(),
    updatedAt: null,
  })
})
