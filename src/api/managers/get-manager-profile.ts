import { api } from '@/lib/axios'

export interface GetManagerProfileResponse {
  name: string
  id: string
  email: string
  phone: string | null
  createdAt: Date | null
  updatedAt: Date | null
}

export async function getManagerProfile() {
  const response =
    await api.auth.get<GetManagerProfileResponse>('/managers/profile')

  return response.data
}
