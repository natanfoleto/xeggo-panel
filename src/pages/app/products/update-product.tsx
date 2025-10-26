import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import { getProduct } from '@/api/products/get-product'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import { ProductForm } from './product-form'
import { UpdateProductSkeleton } from './update-product-skeleton'

interface UpdateProductProps {
  productId: string
}

export function UpdateProduct({ productId }: UpdateProductProps) {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct({ productId }),
    staleTime: 1000 * 60 * 15, // 15 minutes
  })

  const product = data?.product

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Editar
        </DropdownMenuItem>
      </DialogTrigger>

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
  )
}
