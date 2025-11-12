import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function UpgradeSkeleton() {
  return (
    <div className="flex min-h-[calc(100vh-150px)] items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-3 text-center">
          <Skeleton className="mx-auto h-9 w-64" />
          <Skeleton className="mx-auto h-4 w-80" />
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="relative space-y-3 rounded-lg border p-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>

            <div className="space-y-1">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>

            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>

          <div className="relative space-y-3 rounded-lg border p-6">
            <div className="absolute -top-3 right-1/2 translate-x-1/2">
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-4 w-36" />
            </div>

            <div className="space-y-1">
              <Skeleton className="h-8 w-36" />
              <Skeleton className="h-4 w-24" />
            </div>

            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="mx-auto h-3 w-64" />
        </CardFooter>
      </Card>
    </div>
  )
}
