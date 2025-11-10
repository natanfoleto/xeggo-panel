import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { getDeliverySettings } from '@/api/manager/restaurants/get-delivery-settings'
import { updateDeliverySettings } from '@/api/manager/restaurants/update-delivery-settings'
import { appalert } from '@/components/app-alert/app-alert-context'
import { FormPriceInput } from '@/components/form/form-price-input'
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

import { DeliverySettingsSkeleton } from './delivery-settings-skeleton'

const deliverySettingsSchema = z.object({
  deliveryFeeInCents: z
    .number()
    .min(0, 'O valor deve ser maior ou igual a zero')
    .nullable(),
})

type DeliverySettingsSchema = z.infer<typeof deliverySettingsSchema>

export function UpdateDeliverySettings() {
  const { data, isLoading } = useQuery({
    queryKey: ['delivery-settings'],
    queryFn: getDeliverySettings,
  })

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<DeliverySettingsSchema>({
    resolver: zodResolver(deliverySettingsSchema),
    defaultValues: {
      deliveryFeeInCents: 0,
    },
  })

  useEffect(() => {
    if (data) {
      reset({
        deliveryFeeInCents: data.deliveryFeeInCents ?? 0,
      })
    }
  }, [data, reset])

  const { mutateAsync: updateDeliverySettingsFn } = useMutation({
    mutationFn: updateDeliverySettings,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['delivery-settings'],
      })

      appalert.success(
        'Excelente',
        'Configurações de entrega atualizadas com sucesso.',
      )
    },
  })

  const onSubmit = async (formData: DeliverySettingsSchema) => {
    await updateDeliverySettingsFn({
      deliveryFeeInCents:
        formData.deliveryFeeInCents === 0 ? null : formData.deliveryFeeInCents,
    })

    reset(formData)
  }

  if (isLoading) return <DeliverySettingsSkeleton />

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Configurações de entrega
        </CardTitle>

        <CardDescription>
          Configure a taxa de entrega do seu estabelecimento
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="deliveryFee">
              Taxa de entrega (R$) - (Deixe zerado para não cobrar taxa de
              entrega)
            </Label>

            <FormPriceInput
              value={watch('deliveryFeeInCents') ?? 0}
              onChange={(value) =>
                setValue('deliveryFeeInCents', value, { shouldDirty: true })
              }
              disabled={isLoading || isSubmitting}
              error={errors.deliveryFeeInCents?.message}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading || isSubmitting || !isDirty}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Salvar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
