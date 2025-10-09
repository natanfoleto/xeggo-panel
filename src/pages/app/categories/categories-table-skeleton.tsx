import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export function CategoriesTableSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => {
        return (
          <TableRow key={i}>
            <TableCell className="font-medium">
              <Skeleton className="h-4 w-[200px]" />
            </TableCell>

            <TableCell className="max-w-[400px]">
              <Skeleton className="h-4 w-[350px]" />
            </TableCell>

            <TableCell className="px-4">
              <div className="flex items-center justify-end gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </TableCell>
          </TableRow>
        )
      })}
    </>
  )
}
