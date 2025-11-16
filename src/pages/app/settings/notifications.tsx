import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function Notifications() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Preferências de notificação
        </CardTitle>

        <CardDescription>
          Configure como e quando você deseja receber notificações
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground text-sm">
          Nenhuma notificação para configurar.
        </p>
      </CardContent>
    </Card>
  )
}
