import { api } from '@/lib/axios'

export interface CopyProductParams {
  productId: string
}

export interface CopyProductResponse {
  productId: string
}

export async function copyProduct({ productId }: CopyProductParams) {
  const response = await api.manager.post<CopyProductResponse>(
    `/products/${productId}/copy`,
  )

  return response.data
}
