import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { getProfile, type Profile } from '@/api/manager/profile/get-profile'
import {
  updateProfile,
  type UpdateProfileRequest,
} from '@/api/manager/profile/update-profile'
import { FormInput } from '@/components/form/form-input'
import { FormPhoneInput } from '@/components/form/form-phone-input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'

const profileSchema = z.object({
  name: z.string().min(1, { message: 'Informe seu nome completo' }),
  email: z.string().email({ message: 'Informe um e-mail válido' }),
  phone: z.string().nullable(),
})

type ProfileSchema = z.infer<typeof profileSchema>

export function UpdateProfile() {
  const queryClient = useQueryClient()

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })

  const profile = profileData?.profile

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    values: {
      name: profile?.name ?? '',
      email: profile?.email ?? '',
      phone: profile?.phone ?? null,
    },
  })

  function updateProfileDataOnCache({ name, phone }: UpdateProfileRequest) {
    const cached = queryClient.getQueryData<{ profile: Profile }>(['profile'])

    console.log(cached)

    if (cached) {
      queryClient.setQueryData<{ profile: Profile }>(['profile'], {
        ...cached,
        profile: {
          ...cached.profile,
          name,
          phone,
        },
      })
    }

    return { cached }
  }

  const { mutateAsync: updateProfileFn } = useMutation({
    mutationFn: updateProfile,
    onMutate: ({ name, phone }: ProfileSchema) => {
      const { cached } = updateProfileDataOnCache({
        name,
        phone,
      })

      return { previousProfile: cached }
    },
    onError(_, __, context) {
      if (context?.previousProfile) {
        queryClient.setQueryData(['profile'], context.previousProfile)
      }
    },
  })

  async function handleUpdateProfile(data: ProfileSchema) {
    await updateProfileFn({
      name: data.name,
      email: data.email,
      phone: data.phone,
    })

    reset(data)
  }

  function handleCancel() {
    reset({
      name: profile?.name ?? '',
      email: profile?.email ?? '',
      phone: profile?.phone ?? null,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Geral</CardTitle>

        <CardDescription>
          Atualize as informações gerais do seu perfil
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(handleUpdateProfile)}
          className="space-y-6"
        >
          <div className="col-span-12 space-y-2 md:col-span-8">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <FormInput
              id="name"
              disabled={isLoadingProfile}
              {...register('name')}
              error={errors.name?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-right">
              Celular
            </Label>
            <FormPhoneInput
              value={watch('phone') ?? profile?.phone ?? undefined}
              onChange={(value) =>
                setValue('phone', value, { shouldDirty: true })
              }
              disabled={isLoadingProfile}
              error={errors.phone?.message}
            />
          </div>

          {isDirty && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={handleCancel}>
                Cancelar
              </Button>

              <Button type="submit" disabled={isSubmitting || !isDirty}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Salvar'}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
