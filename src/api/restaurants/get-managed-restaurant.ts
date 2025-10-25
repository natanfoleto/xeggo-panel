import { api } from '@/lib/axios'

export interface GetManagedRestaurantResponse {
  id: string
  name: string
  description: string | null
  primaryColor: string | null
  avatarUrl: string | null
  managerId: string | null
  createdAt: Date | null
  updatedAt: Date | null
}

export async function getManagedRestaurant() {
  const response = await api.auth.get<GetManagedRestaurantResponse>(
    '/managed-restaurant',
  )

  return response.data
}
