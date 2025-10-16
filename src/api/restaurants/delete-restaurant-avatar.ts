import { api } from '@/lib/axios'

export async function deleteRestaurantAvatar() {
  const response = await api.auth.delete('/avatar')

  return response.data
}
