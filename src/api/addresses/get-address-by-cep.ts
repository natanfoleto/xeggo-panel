import { api } from '@/lib/axios'

export interface GetAddressByCepResponse {
  cep: string
  street: string
  complement: string | null
  neighborhood: string
  city: string
  state: string
}

export async function getAddressByCep(cep: string) {
  const response = await api.deauth.get<GetAddressByCepResponse>(
    `/addresses/cep/${cep}`,
  )

  return response.data
}
