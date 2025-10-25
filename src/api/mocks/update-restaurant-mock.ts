import { http, HttpResponse } from 'msw'

import type { UpdateRestaurantRequest } from '../restaurants/update-restaurant'

export const updateRestaurantMock = http.put<never, UpdateRestaurantRequest>(
  '/profile/manager',
  async ({ request }) => {
    const { name } = await request.json()

    if (name === 'Invalid name') {
      return new HttpResponse(null, { status: 400 })
    } else {
      return new HttpResponse(null, { status: 204 })
    }
  },
)
