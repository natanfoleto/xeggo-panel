import { RotateCw } from 'lucide-react'

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
  const usage = [
    {
      id: 'orders',
      label: 'Pedidos este mês',
      current: 387,
      limit: 1000,
      unlimited: false,
    },
    {
      id: 'products',
      label: 'Produtos cadastrados',
      current: 90,
      limit: 100,
      unlimited: false,
    },
    {
      id: 'categories',
      label: 'Categorias',
      current: 15,
      limit: 20,
      unlimited: false,
    },
    {
      id: 'staff',
      label: 'Membros da equipe',
      current: 1,
      limit: 5,
      unlimited: false,
    },
  ]

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date)
  }

  const calculatePercentage = (current: number, limit: number) => {
    return Math.round((current / limit) * 100)
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
              <p className="font-medium">Plano mensal</p>
              <p className="text-muted-foreground text-sm">
                Sua assinatura será renovada automaticamente em{' '}
                {formatDate(new Date())}.
              </p>
            </div>

            <Button variant="outline" size="sm">
              Atualizar plano
            </Button>
          </div>
        </div>

        <Separator />

        {usage.map((item) => {
          const percentage = item.unlimited
            ? 0
            : calculatePercentage(item.current, item.limit)

          const progressColorClass = cn(
            percentage >= 90 && '[&>div]:bg-red-400',
            percentage >= 70 && percentage < 90 && '[&>div]:bg-yellow-300',
            percentage < 70 && '[&>div]:bg-primary',
          )

          return (
            <div key={item.id}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.label}</span>

                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">
                      {item.unlimited ? (
                        <span className="text-primary font-semibold">
                          Ilimitado
                        </span>
                      ) : (
                        <>
                          {item.current}/{item.limit}
                        </>
                      )}
                    </span>
                    {!item.unlimited && (
                      <span className="text-xs font-medium">{percentage}%</span>
                    )}
                  </div>
                </div>

                {!item.unlimited && (
                  <Progress
                    value={percentage}
                    className={cn('h-2', progressColorClass)}
                  />
                )}
              </div>
            </div>
          )
        })}

        <span className="text-muted-foreground flex items-center gap-2 text-xs">
          <RotateCw className="hover:text-foreground size-4 cursor-pointer transition-colors" />
          Última atualização: há menos de um minuto
        </span>
      </CardContent>
    </Card>
  )
}
