import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function UpgradeSkeleton() {
  return (
    <div className="from-background via-background to-muted/20 bg-linear-to-br py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12 space-y-4 text-center">
          <Skeleton className="mx-auto h-9 w-64" />
          <Skeleton className="mx-auto h-4 w-80" />
        </div>

        <div className="mb-8 flex justify-center">
          <div className="bg-muted inline-flex items-center gap-1 rounded-full p-1">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <Card
              key={i}
              className="relative flex flex-col rounded-2xl border-2 p-8 shadow-lg"
            >
              <Skeleton className="absolute -top-3 left-1/2 h-6 w-28 -translate-x-1/2 rounded-full" />

              <div className="mb-6 space-y-3">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-32 rounded-full" />
              </div>

              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              <div className="mt-8">
                <Skeleton className="h-11 w-full rounded-md" />
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 space-y-3 text-center">
          <Skeleton className="mx-auto h-4 w-72" />
          <Skeleton className="mx-auto h-3 w-64" />
        </div>
      </div>
    </div>
  )
}
