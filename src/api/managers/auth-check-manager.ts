import { api } from '@/lib/axios'

export interface AuthCheckManagerResponse {
  authenticated: boolean
}

export async function authCheckManager() {
  const response = await api.auth.get<AuthCheckManagerResponse>(
    '/managers/auth/check',
  )

  return response.data
}
