import { api } from '@/lib/axios'

export async function deleteAvatar() {
  const response = await api.manager.delete('/avatar')

  return response.data
}
