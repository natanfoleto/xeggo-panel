import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { deleteAvatar } from '@/api/manager/restaurants/delete-avatar'
import { getAsaasAccount } from '@/api/manager/restaurants/asaas/get-asaas-account'
import {
  getManagedRestaurant,
  type ManagedRestaurant,
} from '@/api/manager/restaurants/get-managed-restaurant'
import { updateRestaurant } from '@/api/manager/restaurants/update-restaurant'
import { uploadAvatar } from '@/api/manager/restaurants/upload-avatar'
import { FormCpfCnpjInput } from '@/components/form/form-cpf-cnpj-input'
import { FormInput } from '@/components/form/form-input'
import { FormTextarea } from '@/components/form/form-text-area'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { getInitialsName } from '@/utils/get-initials-name'
import { isValidCNPJ, isValidCPF } from '@/utils/validate-document'

import { UpdateRestaurantSkeleton } from './restaurant-skeleton'

const profileSchema = z.object({
  name: z.string().min(1),
  cpfCnpj: z
    .string()
    .min(11, 'Documento inválido')
    .max(14, 'Documento inválido')
    .refine(
      (value) => {
        const only = value.replace(/\D/g, '')

        return only.length === 11 ? isValidCPF(only) : isValidCNPJ(only)
      },
      { message: 'CPF ou CNPJ inválido' },
    ),
  description: z.string().nullable(),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Formato inválido. Use #RRGGBB')
    .nullable(),
})

type ProfileSchema = z.infer<typeof profileSchema>

type UpdatePayload = Omit<ProfileSchema, 'avatarUrl'>

export function UpdateRestaurant() {
  const queryClient = useQueryClient()

  const { data: restaurant, isLoading: isLoadingRestaurant } = useQuery({
    queryKey: ['managed-restaurant'],
    queryFn: getManagedRestaurant,
    staleTime: Infinity,
  })

  const { data: asaasAccount, isLoading: isLoadingAsaasAccount } = useQuery({
    queryKey: ['asaas-account'],
    queryFn: getAsaasAccount,
  })

  const [avatar, setAvatar] = useState<File | string | null>(
    restaurant?.avatarUrl || null,
  )
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isAvatarDirty, setIsAvatarDirty] = useState(false)
  const [showNameChangeAlert, setShowNameChangeAlert] = useState(false)

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
      name: restaurant?.name ?? '',
      cpfCnpj: restaurant?.cpfCnpj ?? '',
      description: restaurant?.description ?? '',
      primaryColor: restaurant?.primaryColor ?? '#d4d4d8',
    },
  })

  useEffect(() => {
    if (restaurant?.avatarUrl) {
      setAvatar(restaurant.avatarUrl)
    }
  }, [restaurant?.avatarUrl])

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

  function updateRestaurantDataOnCache({
    name,
    description,
    primaryColor,
  }: ProfileSchema) {
    const cached = queryClient.getQueryData<ManagedRestaurant>([
      'managed-restaurant',
    ])

    if (cached) {
      queryClient.setQueryData<ManagedRestaurant>(['managed-restaurant'], {
        ...cached,
        name,
        description,
        primaryColor,
      })
    }

    return { cached }
  }

  const { mutateAsync: updateRestaurantFn, isPending: isUpdatingRestaurant } =
    useMutation({
      mutationFn: updateRestaurant,
      onMutate: ({
        name,
        description,
        cpfCnpj,
        primaryColor,
      }: UpdatePayload) => {
        const { cached } = updateRestaurantDataOnCache({
          name,
          description,
          cpfCnpj,
          primaryColor,
        })

        return { previousRestaurant: cached }
      },
      onError(_, __, context) {
        if (context?.previousRestaurant) {
          updateRestaurantDataOnCache(context.previousRestaurant)
        }
      },
    })

  const { mutateAsync: uploadAvatarFn, isPending: isUploadingAvatar } =
    useMutation({
      mutationFn: uploadAvatar,
    })

  const { mutateAsync: deleteAvatarFn, isPending: isDeletingAvatar } =
    useMutation({
      mutationFn: deleteAvatar,
    })

  async function handleUpdateRestaurant(data: ProfileSchema) {
    await updateRestaurantFn(data)

    reset(data)

    if (avatar instanceof File) {
      await uploadAvatarFn({ file: avatar })
    } else if (avatar === null && restaurant?.avatarUrl) {
      await deleteAvatarFn()
    }

    setIsAvatarDirty(false)
    setShowNameChangeAlert(false)
  }

  function onSubmit(data: ProfileSchema) {
    if (restaurant?.name !== data.name) {
      setShowNameChangeAlert(true)
    } else {
      handleUpdateRestaurant(data)
    }
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

  function handleCancel() {
    reset({
      name: restaurant?.name ?? '',
      description: restaurant?.description ?? '',
      primaryColor: restaurant?.primaryColor ?? '#d4d4d8',
    })

    setAvatar(restaurant?.avatarUrl || null)
    setIsAvatarDirty(false)
  }

  const hasChanges = isDirty || isAvatarDirty

  if (isLoadingRestaurant || isLoadingAsaasAccount)
    return <UpdateRestaurantSkeleton />

  const isUpdating =
    isUpdatingRestaurant ||
    isUploadingAvatar ||
    isDeletingAvatar ||
    isSubmitting

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Geral</CardTitle>

          <CardDescription>
            Atualize as informações do seu estabelecimento visíveis aos seus
            clientes
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center gap-3">
              <Avatar
                className="size-20 cursor-pointer rounded-xl"
                onClick={handleInputClick}
              >
                <AvatarImage src={avatarPreview || undefined} alt="Avatar" />

                <AvatarFallback className="hover:text-foreground/75 rounded-xl transition-colors">
                  {restaurant ? getInitialsName(restaurant.name) : ''}
                </AvatarFallback>
              </Avatar>

              <div className="text-muted-foreground flex flex-col items-center gap-1">
                {avatar && (
                  <Trash2
                    onClick={handleFileRemove}
                    className="hover:text-foreground size-4 cursor-pointer transition-colors"
                  />
                )}

                {avatar instanceof File && (
                  <span className="text-sm">{avatar.name}</span>
                )}
              </div>
            </div>

            <input
              hidden
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 space-y-2 lg:col-span-6">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <FormInput
                  id="name"
                  {...register('name')}
                  error={errors.name?.message}
                />
              </div>

              <div className="col-span-12 space-y-2 md:col-span-8 lg:col-span-4">
                <Label htmlFor="cpfCnpj">CPF ou CNPJ</Label>
                <FormCpfCnpjInput
                  value={watch('cpfCnpj')}
                  onChange={(value) =>
                    setValue('cpfCnpj', value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  disabled={!!asaasAccount?.asaasAccountId}
                  error={errors.cpfCnpj?.message}
                />
              </div>

              <div className="col-span-12 space-y-2 md:col-span-4 lg:col-span-2">
                <Label htmlFor="primaryColor" className="text-right">
                  Cor primária
                </Label>
                <FormInput
                  id="primaryColor"
                  type="color"
                  {...register('primaryColor')}
                  error={errors.primaryColor?.message}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-right">
                Descrição
              </Label>
              <FormTextarea
                id="description"
                className="min-h-[100px]"
                {...register('description')}
                error={errors.description?.message}
              />
            </div>

            {hasChanges && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={handleCancel}>
                  Cancelar
                </Button>

                <Button type="submit" disabled={isUpdating || !hasChanges}>
                  {isUpdating ? <Loader2 className="animate-spin" /> : 'Salvar'}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      <AlertDialog
        open={showNameChangeAlert}
        onOpenChange={setShowNameChangeAlert}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              Atenção ao alterar o nome do restaurante
            </AlertDialogTitle>

            <AlertDialogDescription className="space-y-2">
              Quando você altera o nome do restaurante, o link do seu cardápio
              também muda. Não esqueça de enviar o novo link para seus clientes
              para que eles possam continuar pedindo normalmente!
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit(handleUpdateRestaurant)}>
              Confirmar alteração
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
