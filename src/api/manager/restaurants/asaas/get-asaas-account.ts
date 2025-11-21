import { api } from '@/lib/axios'

export interface GetAsaasAccountResponse {
  hasAsaasAccount: boolean
  asaasAccountId?: string
  asaasWalletId?: string
  asaasCpfCnpj?: string
  asaasEmail?: string
  asaasLoginEmail?: string
}

export async function getAsaasAccount() {
  const response = await api.manager.get<GetAsaasAccountResponse>(
    '/restaurants/asaas-account',
  )

  return response.data
}
