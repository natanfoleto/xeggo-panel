import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import { getProduct } from '@/api/products/get-product'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { ProductForm } from './product-form'
import { UpdateProductSkeleton } from './update-product-skeleton'

interface UpdateProductProps {
  productId: string
  open: boolean
}

export function UpdateProduct({ productId, open }: UpdateProductProps) {
  const {
    data: responseProduct,
    isLoading: isLoadingProduct,
    isFetching: isFetchingProduct,
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct({ productId }),
    staleTime: 1000 * 60 * 15, // 15 minutes
    enabled: open,
  })

  const product = responseProduct?.product

  return (
    <DialogContent className="flex h-11/12 min-w-2/3 flex-col overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          {isFetchingProduct ? (
            <>
              Carregando produto
              <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
            </>
          ) : (
            product?.name
          )}
        </DialogTitle>
        <DialogDescription>
          {product && `Atualize as informações de ${product?.name}.`}
        </DialogDescription>
      </DialogHeader>

      {isLoadingProduct ? (
        <UpdateProductSkeleton />
      ) : (
        product && <ProductForm initialData={product} />
      )}
    </DialogContent>
  )
}
