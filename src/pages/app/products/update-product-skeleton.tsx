import { Skeleton } from '@/components/ui/skeleton'

export function UpdateProductSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-4 py-4">
      <div className="col-span-12">
        <Skeleton className="h-8 w-full" />
      </div>

      <div className="col-span-8 space-y-1.5">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="col-span-4 space-y-1.5">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="col-span-12 space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-20 w-full" />
      </div>

      <div className="col-span-12 space-y-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="col-span-12 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
        </div>

        <div className="relative space-y-2">
          <Skeleton className="h-72 w-full rounded-sm" />
        </div>
      </div>

      <div className="col-span-12 flex items-center space-x-2">
        <Skeleton className="h-5 w-9 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}
