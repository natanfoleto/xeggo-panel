import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { updateProfile } from '@/api/profile/update-profile'
import { deleteRestaurantAvatar } from '@/api/restaurants/delete-restaurant-avatar'
import {
  getManagedRestaurant,
  type GetManagedRestaurantResponse,
} from '@/api/restaurants/get-managed-restaurant'
import { uploadRestaurantAvatar } from '@/api/restaurants/upload-restaurant-avatar'

import { FormInput } from './form/form-input'
import { FormTextarea } from './form/form-text-area'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Label } from './ui/label'

const storeProfileSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
})

type StoreProfileSchema = z.infer<typeof storeProfileSchema>

type UpdateProfilePayload = Omit<StoreProfileSchema, 'avatarUrl'>

export function StoreProfile() {
  const queryClient = useQueryClient()

  const { data: storeProfile, isLoading: isLoadingStoreProfile } = useQuery({
    queryKey: ['managed-restaurant'],
    queryFn: getManagedRestaurant,
    staleTime: Infinity,
  })

  const [avatar, setAvatar] = useState<File | string | null>(
    storeProfile?.avatarUrl || null,
  )
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isAvatarDirty, setIsAvatarDirty] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<StoreProfileSchema>({
    resolver: zodResolver(storeProfileSchema),
    values: {
      name: storeProfile?.name ?? '',
      description: storeProfile?.description ?? '',
    },
  })

  useEffect(() => {
    if (storeProfile?.avatarUrl) {
      setAvatar(storeProfile.avatarUrl)
    }
  }, [storeProfile?.avatarUrl])

  useEffect(() => {
    if (avatar instanceof File) {
      const objectUrl = URL.createObjectURL(avatar)
      setAvatarPreview(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    } else if (typeof avatar === 'string') {
      setAvatarPreview(avatar)
    } else {
      setAvatarPreview(null)
    }
  }, [avatar])

  function updateProfileDataOnCache({ name, description }: StoreProfileSchema) {
    const cached = queryClient.getQueryData<GetManagedRestaurantResponse>([
      'managed-restaurant',
    ])

    if (cached) {
      queryClient.setQueryData<GetManagedRestaurantResponse>(
        ['managed-restaurant'],
        {
          ...cached,
          name,
          description,
        },
      )
    }

    return { cached }
  }

  const { mutateAsync: updateProfileFn } = useMutation({
    mutationFn: updateProfile,
    onMutate: ({ name, description }: UpdateProfilePayload) => {
      const { cached } = updateProfileDataOnCache({
        name,
        description,
      })

      return { previousProfile: cached }
    },
    onError(_, __, context) {
      if (context?.previousProfile) {
        updateProfileDataOnCache(context.previousProfile)
      }
    },
  })

  const { mutateAsync: uploadAvatarFn } = useMutation({
    mutationFn: uploadRestaurantAvatar,
  })

  const { mutateAsync: deleteAvatarFn } = useMutation({
    mutationFn: deleteRestaurantAvatar,
  })

  async function handleUpdateProfile(data: StoreProfileSchema) {
    await updateProfileFn(data)

    if (avatar instanceof File) {
      await uploadAvatarFn({ file: avatar })
    } else if (avatar === null && storeProfile?.avatarUrl) {
      await deleteAvatarFn()
    }

    setIsAvatarDirty(false)
  }

  function handleInputClick() {
    document.getElementById('avatar')?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    setAvatar(file)
    setIsAvatarDirty(true)

    setTimeout(() => {
      event.target.value = ''
    }, 0)
  }

  const handleFileRemove = () => {
    setAvatar(null)
    setAvatarPreview(null)
    setIsAvatarDirty(true)
  }

  const hasChanges = isDirty || isAvatarDirty

  return (
    <DialogContent className="sm:max-w-[520px]">
      <DialogHeader>
        <DialogTitle>Perfil da loja</DialogTitle>
        <DialogDescription>
          Atualize as informações do seu estabelecimento visíveis aos seus
          clientes.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleUpdateProfile)}>
        <div className="grid gap-4 py-4">
          <div className="mb-4 flex justify-center">
            <div className="flex flex-col items-center gap-3">
              <Avatar
                className="size-20 cursor-pointer"
                onClick={handleInputClick}
              >
                <AvatarImage src={avatarPreview || undefined} alt="Avatar" />
                <AvatarFallback className="hover:text-foreground/75 transition-colors">
                  NF
                </AvatarFallback>
              </Avatar>

              {avatar && (
                <div
                  onClick={handleFileRemove}
                  className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 text-center text-xs transition-colors"
                >
                  <span>
                    {avatar instanceof File ? avatar.name : 'Remover avatar'}
                  </span>
                  <X className="size-3" />
                </div>
              )}
            </div>

            <input
              hidden
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <FormInput
              id="name"
              disabled={isLoadingStoreProfile}
              {...register('name')}
              error={errors.name?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-right">
              Descrição
            </Label>
            <FormTextarea
              id="description"
              className="min-h-[100px]"
              disabled={isLoadingStoreProfile}
              {...register('description')}
              error={errors.description?.message}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" type="button">
              Cancelar
            </Button>
          </DialogClose>

          <Button
            type="submit"
            variant="success"
            disabled={isLoadingStoreProfile || isSubmitting || !hasChanges}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
