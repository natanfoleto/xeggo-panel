import { api } from '@/lib/axios'

export interface Address {
  zipCode: string | null
  street: string | null
  number: string | null
  complement: string | null
  neighborhood: string | null
  city: string | null
  state: string | null
}

export interface GetAddressResponse {
  address: Address
}

export async function getAddress() {
  const response = await api.get<GetAddressResponse>('/address')

  return response.data
}
