import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TableCell, TableRow } from '@/components/ui/table'

import { DeleteCategory } from './delete-category'
import { UpdateCategory } from './update-category'

export interface CategoryTableRowProps {
  category: {
    id: string
    name: string
    description: string | null
  }
}

export function CategoryTableRow({ category }: CategoryTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{category.name}</TableCell>

      <TableCell className="text-muted-foreground max-w-[400px] truncate">
        {category.description || 'Sem descrição'}
      </TableCell>

      <TableCell className="text-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <UpdateCategory categoryId={category.id} />

            <DeleteCategory
              categoryId={category.id}
              categoryName={category.name}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
