import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Edit, Loader2, MoreHorizontal, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { deleteProduct } from '@/api/products/delete-product'
// import type { GetProductsResponse } from '@/api/products/get-products'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TableCell, TableRow } from '@/components/ui/table'

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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const { mutateAsync: deleteProductFn, isPending: isDeletingProduct } =
    useMutation({
      mutationFn: deleteProduct,
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['products'],
        })

        toast.success('Produto excluído com sucesso!')
      },
      onError: () => {
        toast.error('Erro ao excluir produto')
      },
    })

  async function handleDeleteProduct() {
    if (
      confirm(
        `Tem certeza que deseja excluir o produto "${product.name}"? Esta ação não pode ser desfeita.`,
      )
    ) {
      await deleteProductFn({ productId: product.id })
    }
  }

  return (
    <TableRow>
      <TableCell>
        {product.photoUrl ? (
          <img
            src={product.photoUrl}
            alt={product.name}
            className="h-10 w-10 rounded object-cover"
          />
        ) : (
          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded">
            <span className="text-muted-foreground text-xs" />
          </div>
        )}
      </TableCell>

      <TableCell className="font-medium">{product.name}</TableCell>

      <TableCell className="text-center">
        <Badge variant="outline">{product.category.name}</Badge>
      </TableCell>

      <TableCell className="text-center font-medium">
        {(product.priceInCents / 100).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </TableCell>

      <TableCell className="text-center">
        {product.active ? (
          <Badge variant="outline" className="border-green-500 text-green-700">
            Ativo
          </Badge>
        ) : (
          <Badge variant="outline" className="border-red-500 text-red-700">
            Inativo
          </Badge>
        )}
      </TableCell>

      <TableCell className="text-muted-foreground max-w-[300px] truncate">
        {product.description || 'Sem descrição'}
      </TableCell>

      <TableCell className="text-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="xs">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Ações</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
              <Edit className="h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDeleteProduct}
              disabled={isDeletingProduct}
            >
              {isDeletingProduct ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
