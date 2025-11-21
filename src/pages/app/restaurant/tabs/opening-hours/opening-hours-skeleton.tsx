import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function OpeningHoursSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Horários de funcionamento
        </CardTitle>

        <CardDescription>Carregando horários...</CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="overflow-x-auto">
          <div className="inline-grid min-w-full grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={`header-${index}`} className="text-center">
                <Skeleton className="mx-auto h-5 w-16" />
              </div>
            ))}

            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={`cell-${index}`}
                className="min-h-[120px] space-y-1 rounded-lg border p-2"
              >
                {index % 3 !== 0 ? (
                  <>
                    <Skeleton className="mx-auto h-6 w-full rounded" />
                    {index % 2 === 0 && (
                      <Skeleton className="mx-auto h-6 w-full rounded" />
                    )}
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Skeleton className="h-4 w-16" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
      </CardContent>
    </Card>
  )
}
