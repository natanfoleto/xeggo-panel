import { useQuery } from '@tanstack/react-query'
import { Loader2, Pencil } from 'lucide-react'

import { getProduct } from '@/api/manager/products/get-product'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { ProductForm } from './product-form'
import { UpdateProductSkeleton } from './update-product-skeleton'

interface UpdateProductProps {
  productId: string
}

export function UpdateProduct({ productId }: UpdateProductProps) {
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct({ productId }),
    staleTime: 1000 * 60 * 15,
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="size-8" variant="outline" title="Editar">
          <Pencil />
        </Button>
      </DialogTrigger>

      <DialogContent className="flex h-11/12 min-w-11/12 flex-col overflow-y-auto lg:min-w-2/3">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isLoading ? (
              <>
                Carregando produto
                <Loader2 className="text-muted-foreground size-4 animate-spin" />
              </>
            ) : (
              product?.name
            )}
          </DialogTitle>

          <DialogDescription>
            {product && `Atualize as informações de ${product.name}.`}
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
