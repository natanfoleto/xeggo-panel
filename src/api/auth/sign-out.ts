import { api } from '@/lib/axios'

export async function signOut() {
  await api.deauth.post('/sign-out')
}
