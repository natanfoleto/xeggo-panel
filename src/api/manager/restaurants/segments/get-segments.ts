import type { Segment } from '@/dtos/segments/segment'
import { api } from '@/lib/axios'

export interface GetSegmentsResponse {
  segments: Segment[]
}

export async function getSegments() {
  const response = await api.manager.get<GetSegmentsResponse>('/segments')

  return response.data.segments
}
