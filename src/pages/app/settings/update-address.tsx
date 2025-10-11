// src/components/update-address.tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { getAddress } from '@/api/restaurants/get-address'
import { updateAddress } from '@/api/restaurants/update-address'
import { FormInput } from '@/components/form/form-input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { queryClient } from '@/lib/react-query'

import { AddressSkeleton } from './address-skeleton'

const addressSchema = z.object({
  zipCode: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, 'CEP inválido (formato: 00000-000)')
    .nullable()
    .optional()
    .or(z.literal('')),
  street: z.string().max(200).nullable().optional().or(z.literal('')),
  number: z.string().max(20).nullable().optional().or(z.literal('')),
  complement: z.string().max(100).nullable().optional().or(z.literal('')),
  neighborhood: z.string().max(100).nullable().optional().or(z.literal('')),
  city: z.string().max(100).nullable().optional().or(z.literal('')),
  state: z
    .string()
    .length(2, 'Estado deve ter 2 caracteres (ex: SP)')
    .nullable()
    .optional()
    .or(z.literal('')),
})

type AddressSchema = z.infer<typeof addressSchema>

export function UpdateAddress() {
  const { data, isLoading } = useQuery({
    queryKey: ['address'],
    queryFn: getAddress,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      zipCode: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    },
  })

  useEffect(() => {
    if (data?.address) {
      reset({
        zipCode: data.address.zipCode || '',
        street: data.address.street || '',
        number: data.address.number || '',
        complement: data.address.complement || '',
        neighborhood: data.address.neighborhood || '',
        city: data.address.city || '',
        state: data.address.state || '',
      })
    }
  }, [data, reset])

  const { mutateAsync: updateAddressFn } = useMutation({
    mutationFn: updateAddress,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['address'],
      })

      toast.success('Endereço atualizado com sucesso!')
    },
  })

  const onSubmit = async (formData: AddressSchema) => {
    await updateAddressFn({
      address: {
        zipCode: formData.zipCode || null,
        street: formData.street || null,
        number: formData.number || null,
        complement: formData.complement || null,
        neighborhood: formData.neighborhood || null,
        city: formData.city || null,
        state: formData.state || null,
      },
    })

    reset(formData)
  }

  if (isLoading) return <AddressSkeleton />

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Endereço</CardTitle>

        <CardDescription>
          Informe o endereço do seu estabelecimento
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP</Label>
              <FormInput
                id="zipCode"
                placeholder="00000-000"
                {...register('zipCode')}
                error={errors.zipCode?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <FormInput
                id="state"
                placeholder="SP"
                maxLength={2}
                {...register('state')}
                error={errors.state?.message}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="street">Rua/Avenida</Label>
              <FormInput
                id="street"
                placeholder="Av. Paulista"
                {...register('street')}
                error={errors.street?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <FormInput
                id="number"
                placeholder="1578"
                {...register('number')}
                error={errors.number?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="complement">Complemento</Label>
              <FormInput
                id="complement"
                placeholder="Loja 15"
                {...register('complement')}
                error={errors.complement?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <FormInput
                id="neighborhood"
                placeholder="Bela Vista"
                {...register('neighborhood')}
                error={errors.neighborhood?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <FormInput
                id="city"
                placeholder="São Paulo"
                {...register('city')}
                error={errors.city?.message}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading || isSubmitting || !isDirty}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
