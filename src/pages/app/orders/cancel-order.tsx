import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { cancelOrder } from '@/api/orders/cancel-order'
import type { GetOrdersResponse } from '@/api/orders/get-orders'
import { appalert } from '@/components/app-alert/app-alert-context'
import { FormTextarea } from '@/components/form/form-text-area'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const cancelOrderSchema = z.object({
  cancellationReason: z
    .string()
    .max(500, 'O motivo deve ter no máximo 500 caracteres')
    .optional()
    .nullable(),
})

type CancelOrderFormData = z.infer<typeof cancelOrderSchema>

interface CancelOrderProps {
  orderId: string
  onClose: () => void
}

export function CancelOrder({ orderId, onClose }: CancelOrderProps) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CancelOrderFormData>({
    resolver: zodResolver(cancelOrderSchema),
    defaultValues: {
      cancellationReason: null,
    },
  })

  function updateOrderStatusOnCache(orderId: string) {
    const ordersListingCache = queryClient.getQueriesData<GetOrdersResponse>({
      queryKey: ['orders'],
    })

    ordersListingCache.forEach(([cacheKey, cached]) => {
      if (!cached) return

      queryClient.setQueryData<GetOrdersResponse>(cacheKey, {
        ...cached,
        orders: cached.orders.map((order) =>
          order.orderId === orderId
            ? { ...order, status: 'canceled' as const }
            : order,
        ),
      })
    })
  }

  const { mutateAsync: cancelOrderFn, isPending } = useMutation({
    mutationFn: cancelOrder,
    onSuccess: (_, { orderId }) => {
      updateOrderStatusOnCache(orderId)
      appalert.success('Excelente', 'Pedido cancelado com sucesso.')
      onClose()
    },
  })

  async function onSubmit(data: CancelOrderFormData) {
    await cancelOrderFn({
      orderId,
      cancellationReason: data.cancellationReason,
    })
  }

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Cancelar pedido</DialogTitle>
        <DialogDescription>
          Informe o motivo do cancelamento (opcional). Isso pode ajudar a
          melhorar a experiência do cliente.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormTextarea
          className="h-24"
          placeholder="Informe o motivo do cancelamento (opcional)"
          {...register('cancellationReason')}
          error={errors.cancellationReason?.message}
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Fechar
          </Button>

          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 size-3 animate-spin" />}
            Confirmar cancelamento
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
