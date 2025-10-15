import { api } from '@/lib/axios'

export async function deleteRestaurantAvatar() {
  const response = await api.private.delete('/avatar')

  return response.data
}
