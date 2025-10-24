import { api } from '@/lib/axios'

export interface SignInWithLinkRequest {
  email: string
}

export async function signInWithLink({ email }: SignInWithLinkRequest) {
  await api.deauth.post('/auth/link', { email })
}
