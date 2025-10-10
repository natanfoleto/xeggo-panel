import { api } from '@/lib/axios'

import type { WeekDay } from './get-opening-hours'

export interface UpdateOpeningHoursBody {
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

export async function updateOpeningHours(body: UpdateOpeningHoursBody) {
  const response = await api.put('/opening-hours', body)

  return response.data
}
