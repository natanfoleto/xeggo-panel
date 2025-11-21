import { api } from '@/lib/axios'

export interface UpdateDeliverySettingsRequest {
  deliveryFeeInCents: number | null
}

export async function updateDeliverySettings(
  body: UpdateDeliverySettingsRequest,
) {
  const response = await api.manager.put('/delivery-settings', body)

  return response.data
}
