import { api } from '@/lib/axios'

interface DeliverySettings {
  deliveryFeeInCents: number | null
}

export interface GetDeliverySettingsResponse {
  deliverySettings: DeliverySettings
}

export async function getDeliverySettings() {
  const response =
    await api.manager.get<GetDeliverySettingsResponse>('/delivery-settings')

  return response.data.deliverySettings
}
