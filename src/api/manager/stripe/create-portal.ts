import { api } from '@/lib/axios'

export interface CreatePortalResponse {
  url: string
}

export async function createPortal(): Promise<CreatePortalResponse> {
  const response =
    await api.manager.post<CreatePortalResponse>('/stripe/portal')

  return response.data
}
