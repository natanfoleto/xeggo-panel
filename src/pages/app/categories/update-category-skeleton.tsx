import { Skeleton } from '@/components/ui/skeleton'

export function UpdateCategorySkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-20 w-full" />
      </div>

      <div className="flex justify-end gap-2">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}
