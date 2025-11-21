import { api } from '@/lib/axios'

export interface LinkAsaasAccountRequest {
  cpfCnpj: string
}

export interface LinkAsaasAccountResponse {
  accountId: string
  walletId: string
  asaasCpfCnpj: string
  asaasEmail: string
  asaasLoginEmail: string
  message: string
}

export async function linkAsaasAccount(data: LinkAsaasAccountRequest) {
  const response = await api.manager.post<LinkAsaasAccountResponse>(
    '/restaurants/asaas-account/link',
    data,
  )

  return response.data
}
