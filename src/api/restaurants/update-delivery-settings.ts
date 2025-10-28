import { api } from '@/lib/axios'

export interface UpdateDeliverySettingsBody {
  deliveryFeeInCents: number | null
}

export async function updateDeliverySettings(body: UpdateDeliverySettingsBody) {
  const response = await api.auth.put('/delivery-settings', body)

  return response.data
}
