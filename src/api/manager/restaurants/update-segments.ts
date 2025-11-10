import { api } from '@/lib/axios'

import type { Segment } from './get-segments'

export interface UpdateSegmentsBody {
  segments: {
    selectedSegments: Segment[]
  }
}

export async function updateSegments(body: UpdateSegmentsBody) {
  const response = await api.manager.put('/segments', body)

  return response.data
}
