import { api } from '@/lib/axios'

export type WeekDay =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'

export interface OpeningHour {
  id: string
  weekDay: WeekDay
  openTime: string
  closeTime: string
  createdAt: Date
  updatedAt: Date
}

export interface GetOpeningHoursResponse {
  openingHours: OpeningHour[]
}

export async function getOpeningHours() {
  const response = await api.get<GetOpeningHoursResponse>('/opening-hours')
  return response.data
}
