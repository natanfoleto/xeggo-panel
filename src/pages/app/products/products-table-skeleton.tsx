import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export function ProductsTableSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => {
        return (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-10 w-10 rounded" />
            </TableCell>

            <TableCell className="font-medium">
              <Skeleton className="h-4 w-[200px]" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-5 w-[100px]" />
            </TableCell>

            <TableCell className="font-medium">
              <Skeleton className="h-4 w-[80px]" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-5 w-[60px]" />
            </TableCell>

            <TableCell className="max-w-[300px]">
              <Skeleton className="h-4 w-[300px]" />
            </TableCell>

            <TableCell>
              <Button variant="ghost" size="xs" disabled>
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Ações</span>
              </Button>
            </TableCell>
          </TableRow>
        )
      })}
    </>
  )
}
