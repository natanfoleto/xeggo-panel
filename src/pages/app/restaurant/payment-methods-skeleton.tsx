import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function PaymentMethodsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Métodos de pagamento
        </CardTitle>
        <CardDescription>Carregando métodos de pagamento...</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-10 rounded-md"
              style={{ width: `${Math.random() * 60 + 100}px` }}
            />
          ))}
        </div>

        <div className="flex justify-end">
          <Skeleton className="h-10 w-36" />
        </div>
      </CardContent>
    </Card>
  )
}
