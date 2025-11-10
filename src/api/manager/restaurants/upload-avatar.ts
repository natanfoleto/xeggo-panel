import { api } from '@/lib/axios'

export interface UploadAvatarRequest {
  file: File
}

export interface UploadAvatarResponse {
  avatarUrl: string
}

export async function uploadAvatar({ file }: UploadAvatarRequest) {
  const formData = new FormData()

  if (file) formData.append('file', file)

  const response = await api.manager.post<UploadAvatarResponse>(
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
