import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function AsaasAccountSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-4 w-96" />
      </CardHeader>

      <CardContent className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  )
}
