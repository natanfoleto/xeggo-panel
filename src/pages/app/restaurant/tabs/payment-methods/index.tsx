import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  getPaymentMethods,
  type PaymentMethod,
} from '@/api/manager/restaurants/get-payment-methods'
import { updatePaymentMethods } from '@/api/manager/restaurants/update-payment-methods'
import { appalert } from '@/components/app-alert/app-alert-context'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { queryClient } from '@/lib/react-query'

import { PaymentMethodsSkeleton } from './payment-methods-skeleton'

const paymentMethodLabels: Record<PaymentMethod, string> = {
  cash: 'Dinheiro',
  creditCard: 'Cartão de Crédito',
  debitCard: 'Cartão de Débito',
  pix: 'Pix',
}

const paymentMethodsSchema = z.object({
  selectedMethods: z.array(z.enum(['cash', 'creditCard', 'debitCard', 'pix'])),
})

type PaymentMethodsSchema = z.infer<typeof paymentMethodsSchema>

export function UpdatePaymentMethods() {
  const { data: paymentMethods, isLoading } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: getPaymentMethods,
  })

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<PaymentMethodsSchema>({
    resolver: zodResolver(paymentMethodsSchema),
    defaultValues: {
      selectedMethods: [],
    },
  })

  useEffect(() => {
    if (paymentMethods) setValue('selectedMethods', paymentMethods)
  }, [paymentMethods, setValue])

  const { mutateAsync: updatePaymentMethodsFn } = useMutation({
    mutationFn: updatePaymentMethods,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['payment-methods'],
      })

      appalert.success(
        'Excelente',
        'Métodos de pagamento atualizados com sucesso.',
      )
    },
  })

  const onSubmit = async ({ selectedMethods }: PaymentMethodsSchema) => {
    await updatePaymentMethodsFn({
      paymentMethods: {
        selectedMethods,
      },
    })

    reset({ selectedMethods })
  }

  const selectedMethods = watch('selectedMethods')

  const toggleMethod = (method: PaymentMethod) => {
    const isSelected = selectedMethods.includes(method)

    if (isSelected) {
      setValue(
        'selectedMethods',
        selectedMethods.filter((m) => m !== method),
        { shouldDirty: true },
      )
    } else {
      setValue('selectedMethods', [...selectedMethods, method], {
        shouldDirty: true,
      })
    }
  }

  function handleCancel() {
    reset({
      selectedMethods: paymentMethods,
    })
  }

  if (isLoading) return <PaymentMethodsSkeleton />

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Métodos de pagamento
        </CardTitle>

        <CardDescription>
          Selecione as formas de pagamento aceitas pelo seu restaurante
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {Object.entries(paymentMethodLabels).map(([value, label]) => {
              const isSelected = selectedMethods.includes(
                value as PaymentMethod,
              )

              return (
                <Button
                  key={value}
                  type="button"
                  variant="secondary"
                  onClick={() => toggleMethod(value as PaymentMethod)}
                  className={`h-auto px-4 py-2 whitespace-nowrap ${
                    isSelected
                      ? 'bg-violet-100 text-violet-700 hover:bg-violet-100 dark:bg-violet-900/30 dark:text-violet-400'
                      : ''
                  }`}
                >
                  {label}
                </Button>
              )
            })}
          </div>

          {isDirty && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={handleCancel}>
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={isLoading || isSubmitting || !isDirty}
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Salvar'}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
