import { api } from '@/lib/axios'

import type { WeekDay } from './get-opening-hours'

export interface UpdateOpeningHoursRequest {
  openingHours: {
    newOrUpdatedHours: Array<{
      id?: string
      weekDay: WeekDay
      openTime: string
      closeTime: string
    }>
    deletedHourIds: string[]
  }
}

export async function updateOpeningHours(body: UpdateOpeningHoursRequest) {
  const response = await api.manager.put('/opening-hours', body)

  return response.data
}
