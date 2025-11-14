import { api } from '@/lib/axios'

export interface Profile {
  id: string
  name: string
  email: string
  phone: string | null
  createdAt: Date
  updatedAt: Date
}

export interface GetProfileResponse {
  profile: Profile
}

export async function getProfile() {
  const response = await api.manager.get<GetProfileResponse>('/profile')

  return response.data
}
