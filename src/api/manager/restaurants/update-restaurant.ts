import { api } from '@/lib/axios'

export interface UpdateRestaurantRequest {
  name: string
  description: string | null
  primaryColor: string | null
}

export async function updateRestaurant(data: UpdateRestaurantRequest) {
  await api.manager.put('/data', data)
}
