import { api } from '@/lib/axios'

export interface AuthCheckManagerResponse {
  authenticated: boolean
}

export async function authCheckManager() {
  const response = await api.auth.get<AuthCheckManagerResponse>(
    '/auth/check/manager',
  )

  return response.data
}
