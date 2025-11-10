import { api } from '@/lib/axios'

interface GetProfileResponse {
  name: string
  id: string
  email: string
  phone: string | null
  createdAt: Date | null
  updatedAt: Date | null
}

export async function getProfile() {
  const response = await api.manager.get<GetProfileResponse>('/profile')

  return response.data
}
