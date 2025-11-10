import { api } from '@/lib/axios'

export interface UploadProductImageRequest {
  productId: string
  file: File
}

export interface UploadProductImageResponse {
  photoUrl: string
}

export async function uploadProductImage({
  productId,
  file,
}: UploadProductImageRequest) {
  const formData = new FormData()

  if (file) formData.append('file', file)

  const response = await api.manager.post<UploadProductImageResponse>(
    `/products/${productId}/image`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )

  return response.data
}
