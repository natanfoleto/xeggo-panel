import { useMutation, useQuery } from '@tanstack/react-query'
import { Check, Loader2, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'

import { getProfile } from '@/api/manager/profile/get-profile'
import { getManagedRestaurant } from '@/api/manager/restaurants/get-managed-restaurant'
import {
  createCheckout,
  type CreateCheckoutRequest,
} from '@/api/manager/stripe/create-checkout'
import { getSubscription } from '@/api/manager/subscriptions/get-subscription'
import { getPlans } from '@/api/public/plans/get-plans'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/utils/format-currency'

import { UpgradeSkeleton } from './upgrade-skeleton'

export function Upgrade() {
  const navigate = useNavigate()

  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>(
    'annual',
  )
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

  const { data: subscription, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: getSubscription,
  })

  const { data: plans, isLoading: isLoadingPlans } = useQuery({
    queryKey: ['plans'],
    queryFn: getPlans,
  })

  const { data: restaurant, isLoading: isLoadingManagedRestaurant } = useQuery({
    queryKey: ['managed-restaurant'],
    queryFn: getManagedRestaurant,
    staleTime: Infinity,
  })

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: Infinity,
  })

  const { mutateAsync: createCheckoutFn, isPending } = useMutation({
    mutationFn: async ({ planId, metadata }: CreateCheckoutRequest) => {
      const { url } = await createCheckout({ planId, metadata })
      return url
    },
    onSuccess: (url) => {
      window.location.href = url
    },
  })

  async function handleUpgrade(planId: string) {
    if (!restaurant || !profile) return

    setSelectedPlanId(planId)

    await createCheckoutFn({
      planId,
      metadata: {
        restaurantId: restaurant.id,
        userId: profile.id,
        email: profile.email,
      },
    })
  }

  const isTrialing = subscription?.status === 'trialing'
  const currentPlanName = subscription?.plan?.name

  const filteredPlans = plans?.filter(
    (plan) => plan.type === billingPeriod && plan.name !== 'Trial',
  )

  const getDiscount = (planName: string) => {
    if (billingPeriod === 'monthly') return 0
    return planName === 'Ilimitado' ? 20 : 15
  }

  if (
    isLoadingSubscription ||
    isLoadingProfile ||
    isLoadingManagedRestaurant ||
    isLoadingPlans
  )
    return <UpgradeSkeleton />

  return (
    <>
      <Helmet title="Fazer upgrade" />

      <div className="from-background via-background to-muted/20 bg-linear-to-br py-12">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
              Escolha seu plano
            </h1>

            <p className="text-muted-foreground mx-auto max-w-2xl">
              {isTrialing
                ? 'Seu período de teste está acabando. Continue aproveitando todos os recursos.'
                : 'Escale seu negócio com o plano ideal para você'}
            </p>
          </div>

          <div className="mb-8 flex justify-center">
            <div className="bg-muted inline-flex items-center gap-1 rounded-full p-1">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={cn(
                  'cursor-pointer rounded-full px-6 py-2 text-sm font-medium transition-all',
                  billingPeriod === 'monthly'
                    ? 'bg-violet-500 text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                Mensal
              </button>

              <button
                onClick={() => setBillingPeriod('annual')}
                className={cn(
                  'relative cursor-pointer rounded-full px-6 py-2 text-sm font-medium transition-all',
                  billingPeriod === 'annual'
                    ? 'bg-violet-500 text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                Anual
                <span className="ml-2 rounded-full bg-green-500 px-2 py-0.5 text-xs text-white">
                  -20%
                </span>
              </button>
            </div>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
            {filteredPlans?.map((plan) => {
              const isCurrentPlan = currentPlanName === plan.name
              const discount = getDiscount(plan.name)
              const features = plan.features
              const isPopular = plan.name === 'Ilimitado'
              const isProcessing = isPending && selectedPlanId === plan.id

              return (
                <div
                  key={plan.id}
                  className={cn(
                    'bg-card relative flex flex-col rounded-2xl border-2 p-8 shadow-lg transition-all hover:shadow-xl',
                    isPopular
                      ? 'border-violet-500/75'
                      : 'border-border hover:border-violet-500/75',
                    isCurrentPlan && 'opacity-75',
                  )}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-violet-500 px-4 py-1 text-xs font-semibold text-white">
                      <Sparkles className="size-3" />
                      Mais popular
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="bg-foreground text-background absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-medium">
                      Plano atual
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="mb-2 text-xl font-bold">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">
                        {formatCurrency(plan.priceInCents / 100).split(',')[0]}
                      </span>

                      <span className="text-muted-foreground text-xl font-bold">
                        ,{formatCurrency(plan.priceInCents / 100).split(',')[1]}
                      </span>

                      <span className="text-muted-foreground text-sm">
                        /{billingPeriod === 'monthly' ? 'mês' : 'ano'}
                      </span>
                    </div>

                    {billingPeriod === 'annual' && (
                      <p className="text-muted-foreground mt-1 text-xs">
                        {formatCurrency(Math.round(plan.priceInCents / 12))}/mês
                      </p>
                    )}

                    {discount > 0 && (
                      <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Economize {discount}% no plano anual
                      </div>
                    )}
                  </div>

                  <ul className="mb-8 flex-1 space-y-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-violet-100 p-1 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                          <Check className="size-3.5" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrentPlan &&
                  subscription?.plan?.type === billingPeriod ? (
                    <Button
                      onClick={() => navigate('/settings?tab=plans')}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      Gerenciar plano
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={isPending}
                      className={cn(
                        'w-full',
                        isPopular &&
                          'bg-violet-500 text-white shadow-lg hover:bg-violet-600',
                      )}
                      size="lg"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Processando...
                        </>
                      ) : isCurrentPlan &&
                        subscription?.plan?.type !== billingPeriod ? (
                        `Mudar para ${billingPeriod === 'monthly' ? 'mensal' : 'anual'}`
                      ) : isTrialing ? (
                        'Começar agora'
                      ) : (
                        'Mudar para este plano'
                      )}
                    </Button>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4 text-sm">
              Pagamento 100% seguro via Stripe · Cancele quando quiser · Suporte
              dedicado
            </p>

            <p className="text-muted-foreground text-xs">
              Ao continuar, você concorda com nossos{' '}
              <a
                href="https://www.xeggo.app/terms-and-privacy"
                target="_blank"
                className="text-foreground hover:underline"
                rel="noreferrer"
              >
                Termos de Serviço
              </a>{' '}
              e{' '}
              <a
                href="https://www.xeggo.app/terms-and-privacy"
                target="_blank"
                className="text-foreground hover:underline"
                rel="noreferrer"
              >
                Política de Privacidade
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
