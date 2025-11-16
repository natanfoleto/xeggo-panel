import { api } from '@/lib/axios'

export interface CopyProductRequest {
  productId: string
}

export interface CopyProductResponse {
  productId: string
}

export async function copyProduct({ productId }: CopyProductRequest) {
  const response = await api.manager.post<CopyProductResponse>(
    `/products/${productId}/copy`,
  )

  return response.data
}
