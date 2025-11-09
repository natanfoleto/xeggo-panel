import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { createCoupon } from '@/api/coupons/create-coupon'
import { updateCoupon } from '@/api/coupons/update-coupon'
import { appalert } from '@/components/app-alert/app-alert-context'
import { FormInput } from '@/components/form/form-input'
import { FormPriceInput } from '@/components/form/form-price-input'
import { FormSelect } from '@/components/form/form-select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { SelectItem } from '@/components/ui/select'
import { queryClient } from '@/lib/react-query'

const couponFormSchema = z.object({
  code: z.string().min(1, 'Código é obrigatório').max(50),
  type: z.enum(['percentage', 'fixed'], {
    message: 'Tipo é obrigatório',
  }),
  value: z.number().int().positive('Valor deve ser positivo'),
  minOrderInCents: z.number().int().positive().nullable().optional(),
  maxDiscountInCents: z.number().int().positive().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
  usageLimit: z.number().int().positive().nullable().optional(),
  active: z.boolean(),
})

export type CouponFormSchema = z.infer<typeof couponFormSchema>

interface CouponFormProps {
  initialData?: Partial<CouponFormSchema> & { id?: string }
  isLoading?: boolean
}

export function CouponForm({
  initialData,
  isLoading = false,
}: CouponFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CouponFormSchema>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: initialData?.code ?? '',
      type: initialData?.type ?? 'fixed',
      value: initialData?.value ?? 0,
      minOrderInCents: initialData?.minOrderInCents ?? null,
      maxDiscountInCents: initialData?.maxDiscountInCents ?? null,
      expiresAt: initialData?.expiresAt ?? null,
      usageLimit: initialData?.usageLimit ?? null,
      active: initialData?.active ?? true,
    },
  })

  const couponType = watch('type')

  const { mutateAsync: createCouponFn } = useMutation({
    mutationFn: createCoupon,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['coupons'],
      })

      appalert.success('Excelente', 'Cupom criado com sucesso.')
    },
  })

  const { mutateAsync: updateCouponFn } = useMutation({
    mutationFn: updateCoupon,
    onSuccess: async (_, data) => {
      await queryClient.invalidateQueries({
        queryKey: ['coupons'],
      })

      reset(data)

      appalert.success('Excelente', 'Cupom atualizado com sucesso.')
    },
  })

  const onSubmit = async (data: CouponFormSchema) => {
    const couponId = initialData?.id

    if (couponId) {
      await updateCouponFn({
        couponId,
        ...data,
      })
    } else {
      await createCouponFn(data)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="code">Código</Label>
          <FormInput
            id="code"
            placeholder="PROMO10"
            disabled={isLoading || isSubmitting}
            {...register('code')}
            error={errors.code?.message}
            className="uppercase"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="type">Tipo</Label>
          <FormSelect
            className="w-full"
            disabled={isLoading || isSubmitting}
            onValueChange={(value) =>
              setValue('type', value as 'percentage' | 'fixed', {
                shouldDirty: true,
              })
            }
            defaultValue={initialData?.type}
            error={errors.type?.message}
          >
            <SelectItem value="fixed">Valor fixo</SelectItem>
            <SelectItem value="percentage">Porcentagem</SelectItem>
          </FormSelect>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="value">
            {couponType === 'percentage' ? 'Porcentagem (%)' : 'Valor'}
          </Label>
          {couponType === 'percentage' ? (
            <FormInput
              id="value"
              type="number"
              placeholder="10"
              disabled={isLoading || isSubmitting}
              {...register('value', { valueAsNumber: true })}
              error={errors.value?.message}
            />
          ) : (
            <FormPriceInput
              value={watch('value')}
              onChange={(value) =>
                setValue('value', value, { shouldDirty: true })
              }
              disabled={isLoading || isSubmitting}
              error={errors.value?.message}
            />
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="minOrderInCents">Pedido mínimo</Label>
          <FormPriceInput
            value={watch('minOrderInCents') ?? 0}
            onChange={(value) =>
              setValue('minOrderInCents', value || null, {
                shouldDirty: true,
              })
            }
            disabled={isLoading || isSubmitting}
            error={errors.minOrderInCents?.message}
          />
        </div>
      </div>

      {couponType === 'percentage' && (
        <div className="space-y-1.5">
          <Label htmlFor="maxDiscountInCents">Desconto máximo</Label>
          <FormPriceInput
            value={watch('maxDiscountInCents') ?? 0}
            onChange={(value) =>
              setValue('maxDiscountInCents', value || null, {
                shouldDirty: true,
              })
            }
            disabled={isLoading || isSubmitting}
            error={errors.maxDiscountInCents?.message}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="expiresAt">Data de expiração</Label>
          <FormInput
            id="expiresAt"
            type="datetime-local"
            disabled={isLoading || isSubmitting}
            {...register('expiresAt')}
            error={errors.expiresAt?.message}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="usageLimit">Limite de usos</Label>
          <FormInput
            id="usageLimit"
            type="number"
            placeholder="50"
            disabled={isLoading || isSubmitting}
            {...register('usageLimit', {
              setValueAs: (value) =>
                value === '' || isNaN(value) ? null : Number(value),
            })}
            error={errors.usageLimit?.message}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading || isSubmitting || !isDirty}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : 'Salvar cupom'}
        </Button>
      </div>
    </form>
  )
}
