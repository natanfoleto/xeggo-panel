import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function UpdateRestaurantSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-64" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-96" />
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-20 w-20 rounded-xl" />

          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <Skeleton className="col-span-12 h-10 lg:col-span-6" />
          <Skeleton className="col-span-12 h-10 md:col-span-8 lg:col-span-4" />
          <Skeleton className="col-span-12 h-10 md:col-span-4 lg:col-span-2" />
        </div>

        <Skeleton className="h-24 w-full" />
      </CardContent>
    </Card>
  )
}
