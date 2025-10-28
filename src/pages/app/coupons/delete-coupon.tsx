import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { deleteCoupon } from '@/api/coupons/delete-coupon'
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
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
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

      toast.success('Cupom deletado com sucesso!')

      setIsOpen(false)
    },
  })

  async function handleDeleteCoupon() {
    await deleteCouponFn({ couponId })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Excluir
        </DropdownMenuItem>
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
