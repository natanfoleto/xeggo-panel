import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Loader2, RotateCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { getUsageLimits } from '@/api/manager/usage/get-usage-limits'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export function Usage() {
  const navigate = useNavigate()

  const { data, isLoading, refetch, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ['usage-limits'],
    queryFn: getUsageLimits,
    refetchInterval: 60000,
  })

  const getLabelByKey = (key: string) => {
    const labels: Record<string, string> = {
      ordersPerMonth: 'Pedidos este mês',
      products: 'Produtos cadastrados',
      categories: 'Categorias',
      coupons: 'Cupons cadastrados',
    }

    return labels[key] || key
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Limites de uso do plano
            <Loader2 className="text-muted-foreground size-4 animate-spin" />
          </CardTitle>
          <CardDescription>
            Acompanhe o consumo dos recursos do seu plano
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Limites de uso do plano</CardTitle>
          <CardDescription>
            Acompanhe o consumo dos recursos do seu plano
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Não foi possível carregar os limites de uso.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Limites de uso do plano
        </CardTitle>
        <CardDescription>
          Acompanhe o consumo dos recursos do seu plano
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            Plano
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Plano {data.plan.name}</p>
              <p className="text-muted-foreground text-sm">
                {data.plan.type === 'monthly' ? 'Mensal' : 'Anual'}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/upgrade')}
            >
              Atualizar plano
            </Button>
          </div>
        </div>

        <Separator />

        {data.limits.map((item) => {
          const progressColorClass = cn(
            item.percentage >= 90 && '[&>div]:bg-red-400',
            item.percentage >= 70 &&
              item.percentage < 90 &&
              '[&>div]:bg-yellow-300',
            item.percentage < 70 && '[&>div]:bg-primary',
          )

          return (
            <div key={item.key}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {getLabelByKey(item.key)}
                  </span>

                  <div className="flex items-center gap-2">
                    {item.unlimited ? (
                      <div className="text-primary text-sm font-medium">
                        {item.current}{' '}
                        <span className="text-muted-foreground">/</span>{' '}
                        Ilimitado
                      </div>
                    ) : (
                      <>
                        <span className="text-muted-foreground text-xs">
                          {item.current}/{item.limit}
                        </span>
                        <span className="text-xs font-medium">
                          {item.percentage}%
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {!item.unlimited && (
                  <Progress
                    value={item.percentage}
                    className={cn('h-2', progressColorClass)}
                  />
                )}
              </div>
            </div>
          )
        })}

        <span className="text-muted-foreground flex items-center gap-2 text-xs">
          <RotateCw
            onClick={() => refetch()}
            className={cn(
              'hover:text-foreground size-4 cursor-pointer transition-colors',
              isFetching && 'animate-spin',
            )}
          />
          Última atualização:{' '}
          {formatDistanceToNow(dataUpdatedAt, {
            addSuffix: true,
            locale: ptBR,
          })}
        </span>
      </CardContent>
    </Card>
  )
}
