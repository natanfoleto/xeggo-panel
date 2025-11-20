import { api } from '@/lib/axios'

export interface CreateAsaasAccountRequest {
  name: string
  email: string
  loginEmail?: string
  cpfCnpj: string
  birthDate?: string
  mobilePhone: string
  phone?: string
  incomeValue: number
  address: string
  addressNumber: string
  complement?: string
  province: string
  postalCode: string
  site?: string
}

export interface CreateAsaasAccountResponse {
  accountId: string
  walletId: string
  asaasCpfCnpj: string
  asaasEmail: string
  asaasLoginEmail: string
  message: string
}

export async function createAsaasAccount(data: CreateAsaasAccountRequest) {
  const response = await api.manager.post<CreateAsaasAccountResponse>(
    '/restaurants/asaas-account',
    data,
  )

  return response.data
}
