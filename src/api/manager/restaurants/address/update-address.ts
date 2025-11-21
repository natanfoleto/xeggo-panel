import { api } from '@/lib/axios'

export interface UpdateAddressRequest {
  address: {
    zipCode?: string | null
    street?: string | null
    number?: string | null
    complement?: string | null
    neighborhood?: string | null
    city?: string | null
    state?: string | null
  }
}

export async function updateAddress({ address }: UpdateAddressRequest) {
  const response = await api.manager.put('/address', { address })

  return response.data
}
