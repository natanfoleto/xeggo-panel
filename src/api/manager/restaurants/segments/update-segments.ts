import { api } from '@/lib/axios'

import type { Segment } from './get-segments'

export interface UpdateSegmentsRequest {
  segments: {
    selectedSegments: Segment[]
  }
}

export async function updateSegments(body: UpdateSegmentsRequest) {
  const response = await api.manager.put('/segments', body)

  return response.data
}
