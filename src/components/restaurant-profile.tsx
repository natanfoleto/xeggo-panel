import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { deleteAvatar } from '@/api/manager/restaurants/delete-avatar'
import {
  getManagedRestaurant,
  type ManagedRestaurant,
} from '@/api/manager/restaurants/get-managed-restaurant'
import { updateRestaurant } from '@/api/manager/restaurants/update-restaurant'
import { uploadAvatar } from '@/api/manager/restaurants/upload-avatar'
import { getInitialsName } from '@/utils/get-initials-name'

import { FormInput } from './form/form-input'
import { FormTextarea } from './form/form-text-area'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog'
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

const restaurantProfileSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Formato inválido. Use #RRGGBB')
    .nullable(),
})

type RestaurantProfileSchema = z.infer<typeof restaurantProfileSchema>

type UpdateRestaurantPayload = Omit<RestaurantProfileSchema, 'avatarUrl'>

export function RestaurantProfile() {
  const queryClient = useQueryClient()

  const { data: managedRestaurant, isLoading: isLoadingManagedRestaurant } =
    useQuery({
      queryKey: ['managed-restaurant'],
      queryFn: getManagedRestaurant,
      staleTime: Infinity,
    })

  const [avatar, setAvatar] = useState<File | string | null>(
    managedRestaurant?.restaurant?.avatarUrl || null,
  )
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isAvatarDirty, setIsAvatarDirty] = useState(false)
  const [showNameChangeAlert, setShowNameChangeAlert] = useState(false)

  const restaurant = managedRestaurant?.restaurant

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<RestaurantProfileSchema>({
    resolver: zodResolver(restaurantProfileSchema),
    values: {
      name: restaurant?.name ?? '',
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
  }: RestaurantProfileSchema) {
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
        primaryColor,
      }: UpdateRestaurantPayload) => {
        const { cached } = updateRestaurantDataOnCache({
          name,
          description,
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

  const isLoading =
    isUpdatingRestaurant || isUploadingAvatar || isDeletingAvatar

  async function handleUpdateRestaurant(data: RestaurantProfileSchema) {
    await updateRestaurantFn(data)

    if (avatar instanceof File) {
      await uploadAvatarFn({ file: avatar })
    } else if (avatar === null && restaurant?.avatarUrl) {
      await deleteAvatarFn()
    }

    setIsAvatarDirty(false)
    setShowNameChangeAlert(false)
  }

  function handleFormSubmit(data: RestaurantProfileSchema) {
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

  const hasChanges = isDirty || isAvatarDirty

  return (
    <>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Perfil da loja</DialogTitle>
          <DialogDescription>
            Atualize as informações do seu estabelecimento visíveis aos seus
            clientes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="mb-4 flex justify-center">
              <div className="flex flex-col items-center gap-3">
                <Avatar
                  className="size-20 cursor-pointer"
                  onClick={handleInputClick}
                >
                  <AvatarImage src={avatarPreview || undefined} alt="Avatar" />
                  <AvatarFallback className="hover:text-foreground/75 transition-colors">
                    {restaurant ? getInitialsName(restaurant.name) : ''}
                  </AvatarFallback>
                </Avatar>

                {avatar && (
                  <div
                    onClick={handleFileRemove}
                    className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 text-center text-xs transition-colors"
                  >
                    <span>
                      {avatar instanceof File ? avatar.name : 'Remover'}
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
                disabled={isLoadingManagedRestaurant}
                {...register('name')}
                error={errors.name?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryColor" className="text-right">
                Cor primária
              </Label>
              <FormInput
                id="primaryColor"
                type="color"
                disabled={isLoadingManagedRestaurant}
                {...register('primaryColor')}
                error={errors.primaryColor?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-right">
                Descrição
              </Label>
              <FormTextarea
                id="description"
                className="min-h-[100px]"
                disabled={isLoadingManagedRestaurant}
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
              disabled={isLoadingManagedRestaurant || isLoading || !hasChanges}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

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
              <p>
                Quando você altera o nome do restaurante, o link do seu cardápio
                também muda. Não esqueça de enviar o novo link para seus
                clientes para que eles possam continuar pedindo normalmente!
              </p>
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
