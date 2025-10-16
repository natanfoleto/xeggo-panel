import { api } from '@/lib/axios'

export type Segment =
  | 'restaurant'
  | 'bakery'
  | 'snackBar'
  | 'pizzeria'
  | 'iceCreamShop'
  | 'coffee'
  | 'fastFood'
  | 'barbecue'
  | 'japanese'
  | 'brazilian'
  | 'italian'
  | 'chinese'
  | 'mexican'
  | 'arabic'
  | 'bar'

export interface GetSegmentsResponse {
  segments: Segment[]
}

export async function getSegments() {
  const response = await api.auth.get<GetSegmentsResponse>('/segments')

  return response.data
}
