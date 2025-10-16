import { api } from '@/lib/axios'

export interface UploadRestaurantAvatarRequest {
  file: File
}

export interface UploadRestaurantAvatarResponse {
  avatarUrl: string
}

export async function uploadRestaurantAvatar({
  file,
}: UploadRestaurantAvatarRequest) {
  const formData = new FormData()

  if (file) formData.append('file', file)

  const response = await api.auth.post<UploadRestaurantAvatarResponse>(
    '/avatar',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )

  return response.data
}
