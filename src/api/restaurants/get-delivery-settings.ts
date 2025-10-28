import { api } from '@/lib/axios'

export interface GetDeliverySettingsResponse {
  deliveryFeeInCents: number | null
}

export async function getDeliverySettings() {
  const response =
    await api.auth.get<GetDeliverySettingsResponse>('/delivery-settings')

  return response.data
}
