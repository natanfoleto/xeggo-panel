import { api } from '@/lib/axios'

export interface AuthCheckResponse {
  authenticated: boolean
}

export async function authCheck() {
  const response = await api.manager.get<AuthCheckResponse>('/auth/check')

  return response.data
}
