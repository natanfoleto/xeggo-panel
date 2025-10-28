import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export function CouponsTableSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => {
        return (
          <TableRow key={i}>
            <TableCell className="font-medium">
              <Skeleton className="h-4 w-[100px]" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-4 w-[80px]" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-4 w-[100px]" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-4 w-[80px]" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-4 w-[100px]" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-6 w-[60px]" />
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
