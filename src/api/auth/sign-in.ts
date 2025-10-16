import { api } from '@/lib/axios'

export interface SignInRequest {
  email: string
}

export async function signIn({ email }: SignInRequest) {
  await api.deauth.post('/authenticate', { email })
}
