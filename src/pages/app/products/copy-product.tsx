import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { copyProduct } from '@/api/products/copy-product'
import { getProduct } from '@/api/products/get-product'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import { ProductForm } from './product-form'
import { UpdateProductSkeleton } from './update-product-skeleton'

interface CopyProductProps {
  productId: string
  productName: string
}

export function CopyProduct({ productId, productName }: CopyProductProps) {
  const queryClient = useQueryClient()
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newProductId, setNewProductId] = useState<string | null>(null)

  const { mutateAsync: copyProductFn, isPending: isCopying } = useMutation({
    mutationFn: copyProduct,
    onSuccess: (data) => {
      setNewProductId(data.productId)
      setIsAlertOpen(false)
      setIsDialogOpen(true)

      queryClient.invalidateQueries({ queryKey: ['products'] })

      toast.success('Produto duplicado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao duplicar produto')
    },
  })

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['product', newProductId],
    queryFn: () => getProduct({ productId: newProductId! }),
    enabled: !!newProductId && isDialogOpen,
    staleTime: 1000 * 60 * 15,
  })

  const product = data?.product

  async function handleCopy() {
    await copyProductFn({ productId })
  }

  function handleDialogOpenChange(isOpen: boolean) {
    setIsDialogOpen(isOpen)

    if (!isOpen) setNewProductId(null)
  }

  return (
    <>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Duplicar
          </DropdownMenuItem>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duplicar {productName}?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja duplicar o produto {productName}? Uma cópia
              será criada com o nome {productName} - cópia.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCopying}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleCopy} disabled={isCopying}>
              {isCopying ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Duplicando...
                </>
              ) : (
                'Confirmar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="flex h-11/12 min-w-2/3 flex-col overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isFetching ? (
                <>
                  Carregando produto
                  <Loader2 className="text-muted-foreground size-4 animate-spin" />
                </>
              ) : (
                product?.name
              )}
            </DialogTitle>

            <DialogDescription>
              {product && `Atualize as informações de ${product?.name}.`}
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <UpdateProductSkeleton />
          ) : (
            product && <ProductForm initialData={product} />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
