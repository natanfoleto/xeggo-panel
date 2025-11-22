import { api } from '@/lib/axios'

export interface RegisterRestaurantRequest {
  restaurantName: string
  cpfCnpj?: string | null
  managerName: string
  email: string
  phone: string
}

export async function registerRestaurant({
  restaurantName,
  cpfCnpj,
  managerName,
  email,
  phone,
}: RegisterRestaurantRequest) {
  await api.public.post('/restaurants', {
    restaurantName,
    cpfCnpj,
    managerName,
    email,
    phone,
  })
}
