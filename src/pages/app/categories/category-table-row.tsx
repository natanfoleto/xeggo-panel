import type { Category } from '@/api/manager/categories/get-categories'
import { TableCell, TableRow } from '@/components/ui/table'

import { DeleteCategory } from './delete-category'
import { UpdateCategory } from './update-category'

export interface CategoryTableRowProps {
  category: Category
}

export function CategoryTableRow({ category }: CategoryTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{category.name}</TableCell>

      <TableCell className="text-muted-foreground max-w-[400px] truncate">
        {category.description || 'Sem descrição'}
      </TableCell>

      <TableCell className="text-muted-foreground flex gap-2">
        <UpdateCategory categoryId={category.id} />
        <DeleteCategory categoryId={category.id} categoryName={category.name} />
      </TableCell>
    </TableRow>
  )
}
