import { api } from '@/lib/axios'

export async function signOut() {
  await api.public.post('/auth/sign-out')
}
