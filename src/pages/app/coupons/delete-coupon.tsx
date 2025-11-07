import { useMutation } from '@tanstack/react-query'
import { Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { deleteCoupon } from '@/api/coupons/delete-coupon'
import { appalert } from '@/components/app-alert/app-alert-context'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { queryClient } from '@/lib/react-query'

interface DeleteCouponProps {
  couponId: string
  couponCode: string
}

export function DeleteCoupon({ couponId, couponCode }: DeleteCouponProps) {
  const [isOpen, setIsOpen] = useState(false)

  const { mutateAsync: deleteCouponFn, isPending } = useMutation({
    mutationFn: deleteCoupon,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['coupons'],
      })

      appalert.success('Excelente', 'Cupom deletado com sucesso.')

      setIsOpen(false)
    },
  })

  async function handleDeleteCoupon() {
    await deleteCouponFn({ couponId })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button className="size-8" variant="outline">
          <Trash2 />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar cupom {couponCode}?</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o cupom {couponCode}? Essa ação não
            pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteCoupon} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Deletando...
              </>
            ) : (
              'Confirmar'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
