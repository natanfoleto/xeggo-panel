import { http, HttpResponse } from 'msw'

import type { GetManagerProfileResponse } from '../managers/get-manager-profile'

export const getManagerProfileMock = http.get<
  never,
  never,
  GetManagerProfileResponse
>('/me', async () => {
  return HttpResponse.json({
    id: 'custom-user-id',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '47828376473',
    createdAt: new Date(),
    updatedAt: null,
  })
})
