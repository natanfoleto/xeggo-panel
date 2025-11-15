import { useMutation, useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CreditCard, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { getInvoices } from '@/api/manager/invoices/get-invoices'
import { createPortal } from '@/api/manager/stripe/create-portal'
import { getSubscription } from '@/api/manager/subscriptions/get-subscription'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/utils/format-currency'

export function Plans() {
  const navigate = useNavigate()

  const { data: subscription, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: getSubscription,
  })

  const { data: invoicesData, isLoading: isLoadingInvoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => getInvoices({ limit: 10 }),
  })

  const { mutateAsync: openPortal, isPending: isOpeningPortal } = useMutation({
    mutationFn: createPortal,
    onSuccess: (data) => {
      window.location.href = data.url
    },
  })

  const getInvoiceStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      paid: 'Pago',
      open: 'Pendente',
      void: 'Cancelado',
      draft: 'Rascunho',
    }

    return statusMap[status] || status
  }

  if (isLoadingSubscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Planos e cobranças{' '}
            {!isLoadingSubscription && (
              <Loader2 className="text-muted-foreground size-4 animate-spin" />
            )}
          </CardTitle>
          <CardDescription>
            Planos, histórico de pagamentos e faturas
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    )
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Planos e cobranças</CardTitle>
          <CardDescription>
            Planos, histórico de pagamentos e faturas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Nenhuma assinatura encontrada.
          </p>
        </CardContent>
      </Card>
    )
  }

  const stripeCustomerId = subscription.stripeCustomerId
  const isTrial = subscription.status === 'trialing'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Planos e cobranças</CardTitle>
        <CardDescription>
          Planos, histórico de pagamentos e faturas
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Plano</h3>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex flex-col">
                <p className="font-medium">
                  Plano {subscription.plan.name || 'Desconhecido'}
                </p>
                <span className="text-sm">
                  {subscription.plan.type === 'monthly' ? 'Mensal' : 'Anual'}
                </span>
              </div>

              {isTrial && subscription.trialEnd ? (
                <p className="text-muted-foreground text-xs">
                  Seu trial expira em{' '}
                  {format(subscription.trialEnd, 'dd MMM yyyy', {
                    locale: ptBR,
                  })}
                  .
                </p>
              ) : (
                <p className="text-muted-foreground text-xs">
                  Sua assinatura será renovada automaticamente em{' '}
                  {format(subscription.currentPeriodEnd, 'dd MMM yyyy', {
                    locale: ptBR,
                  })}
                  .
                </p>
              )}
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

        {stripeCustomerId && (
          <>
            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Pagamento</h3>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                    <CreditCard className="size-5" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      {subscription.cardBrand && subscription.cardLast4
                        ? `${subscription.cardBrand} •••• ${subscription.cardLast4}`
                        : '•••• ••••'}
                    </p>

                    <p className="text-muted-foreground text-xs">
                      {subscription.cardExpMonth && subscription.cardExpYear
                        ? `Expira em ${subscription.cardExpMonth}/${subscription.cardExpYear}`
                        : 'Cartão de crédito'}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openPortal()}
                  disabled={isOpeningPortal}
                >
                  {isOpeningPortal ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    'Atualizar'
                  )}
                </Button>
              </div>
            </div>
          </>
        )}

        {stripeCustomerId &&
          invoicesData &&
          invoicesData.invoices.length > 0 && (
            <>
              <Separator />

              <div className="space-y-2">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  Faturas
                </h3>

                {isLoadingInvoices ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <div className="bg-muted h-4 w-20 animate-pulse rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="bg-muted h-4 w-16 animate-pulse rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="bg-muted h-4 w-16 animate-pulse rounded" />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="bg-muted ml-auto h-4 w-8 animate-pulse rounded" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {invoicesData.invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">
                            {format(invoice.createdAt, 'dd MMM yyyy', {
                              locale: ptBR,
                            })}
                          </TableCell>

                          <TableCell>
                            {formatCurrency(invoice.amountPaidInCents / 100)}
                          </TableCell>

                          <TableCell className="text-sm">
                            {getInvoiceStatusLabel(invoice.status)}
                          </TableCell>

                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {invoice.invoicePdf && (
                                <a
                                  href={invoice.invoicePdf}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm hover:underline"
                                >
                                  Ver
                                </a>
                              )}

                              {invoice.hostedInvoiceUrl && (
                                <a
                                  href={invoice.hostedInvoiceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm hover:underline"
                                >
                                  Baixar
                                </a>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </>
          )}

        {stripeCustomerId && (
          <>
            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-semibold">
                {subscription.cancelAt
                  ? 'Cancelamento agendado'
                  : 'Cancelamento'}
              </h3>

              {subscription.cancelAt ? (
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground text-sm">
                    Sua assinatura será encerrada em{' '}
                    <span className="text-foreground font-medium">
                      {format(subscription.cancelAt, 'dd MMM yyyy', {
                        locale: ptBR,
                      })}
                    </span>
                    . Você continuará com acesso até essa data.
                  </p>

                  <Button
                    size="sm"
                    className="bg-violet-100 text-violet-700 hover:bg-violet-100 hover:brightness-125 dark:bg-violet-900/30 dark:text-violet-400"
                    onClick={() => openPortal()}
                    disabled={isOpeningPortal}
                  >
                    {isOpeningPortal ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      'Reativar assinatura'
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground text-sm">
                    Ao cancelar, você perderá acesso a todos os recursos no
                    final do período atual.
                  </p>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openPortal()}
                    disabled={isOpeningPortal}
                  >
                    {isOpeningPortal ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      'Cancelar assinatura'
                    )}
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
