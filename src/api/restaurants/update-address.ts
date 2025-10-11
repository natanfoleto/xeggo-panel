import { api } from '@/lib/axios'

export interface UpdateAddressBody {
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

export async function updateAddress(body: UpdateAddressBody) {
  const response = await api.put('/address', body)

  return response.data
}
