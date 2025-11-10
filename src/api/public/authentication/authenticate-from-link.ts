import { api } from '@/lib/axios'

export interface AuthenticateFromLinkRequest {
  email: string
}

export async function authenticateFromLink({
  email,
}: AuthenticateFromLinkRequest) {
  await api.public.post('/auth/link?app=panel', { email })
}
