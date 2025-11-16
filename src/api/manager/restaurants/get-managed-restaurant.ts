import { api } from '@/lib/axios'

export interface ManagedRestaurant {
  id: string
  name: string
  description: string | null
  slug: string
  primaryColor: string | null
  avatarUrl: string | null
  managerId: string | null
  createdAt: string | null
  updatedAt: string | null
}

export interface GetManagedRestaurantResponse {
  restaurant: ManagedRestaurant
}

export async function getManagedRestaurant() {
  const response = await api.manager.get<GetManagedRestaurantResponse>(
    '/managed-restaurant',
  )

  return response.data.restaurant
}
