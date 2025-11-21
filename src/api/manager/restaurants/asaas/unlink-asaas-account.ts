import { api } from '@/lib/axios'

export async function unlinkAsaasAccount() {
  const response = await api.manager.post('/restaurants/asaas-account/unlink')

  return response.data
}
