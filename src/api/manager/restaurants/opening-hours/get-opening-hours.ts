import type { WeekDay } from '@/dtos/opening-hours/week-day'
import { api } from '@/lib/axios'

export interface OpeningHour {
  id: string
  weekDay: WeekDay
  openTime: string
  closeTime: string
}

export interface GetOpeningHoursResponse {
  openingHours: OpeningHour[]
}

export async function getOpeningHours() {
  const response =
    await api.manager.get<GetOpeningHoursResponse>('/opening-hours')

  return response.data.openingHours
}
