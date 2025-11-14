import { api } from '@/lib/axios'

export interface UpdateProfileRequest {
  name: string
  phone: string | null
}

export async function updateProfile({ name, phone }: UpdateProfileRequest) {
  await api.manager.put('/profile', {
    name,
    phone,
  })
}
