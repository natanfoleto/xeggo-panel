import { TableCell, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/utils/format-currency'

import { CopyProduct } from './copy-product'
import { DeleteProduct } from './delete-product'
import { UpdateProduct } from './update-product'
import { UpdateStatusProduct } from './update-status-product'

export interface ProductTableRowProps {
  product: {
    id: string
    name: string
    description: string | null
    priceInCents: number
    photoUrl: string | null
    active: boolean
    categoryId: string
    category: {
      id: string
      name: string
    }
  }
}

export function ProductTableRow({ product }: ProductTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        {product.photoUrl ? (
          <img
            src={product.photoUrl}
            alt={product.name}
            className="size-10 rounded object-cover"
          />
        ) : (
          <div className="bg-muted flex size-10 items-center justify-center rounded">
            <span className="text-muted-foreground text-xs" />
          </div>
        )}
      </TableCell>

      <TableCell className="font-medium">{product.name}</TableCell>

      <TableCell>{product.category.name}</TableCell>

      <TableCell className="text-center font-medium">
        {formatCurrency(product.priceInCents / 100)}
      </TableCell>

      <TableCell className="text-center">
        <UpdateStatusProduct
          productId={product.id}
          productName={product.name}
          currentStatus={product.active}
        />
      </TableCell>

      <TableCell className="text-muted-foreground max-w-[300px] truncate">
        {product.description || 'Sem descrição'}
      </TableCell>

      <TableCell className="text-muted-foreground">
        <div className="flex h-full items-center gap-2">
          <UpdateProduct productId={product.id} />
          <CopyProduct productId={product.id} productName={product.name} />
          <DeleteProduct productId={product.id} productName={product.name} />
        </div>
      </TableCell>
    </TableRow>
  )
}
