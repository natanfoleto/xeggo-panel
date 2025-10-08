import { http, HttpResponse } from 'msw'

import type { RegisterRestaurantRequest } from '../restaurants/register-restaurant'

export const registerRestaurantMock = http.post<
  never,
  RegisterRestaurantRequest
>('/restaurants', async ({ request }) => {
  const { restaurantName } = await request.json()

  if (restaurantName === 'Xeggo') {
    return new HttpResponse(null, { status: 201 })
  } else {
    return new HttpResponse(null, { status: 400 })
  }
})
