import { api } from '@/lib/axios'

export async function deleteRestaurantAvatar() {
  const response = await api.delete('/avatar')

  return response.data
}
