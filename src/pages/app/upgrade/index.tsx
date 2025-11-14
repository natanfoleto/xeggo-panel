import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'

import { getProfile } from '@/api/manager/profile/get-profile'
import { getManagedRestaurant } from '@/api/manager/restaurants/get-managed-restaurant'
import {
  createCheckout,
  type CreateCheckoutRequest,
} from '@/api/manager/stripe/create-checkout'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { PlanCard } from './plan-card'
import { plans } from './plans'
import { UpgradeSkeleton } from './upgrade-skeleton'

export function Upgrade() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>(
    'annual',
  )

  const { data: managedRestaurant, isLoading: isLoadingManagedRestaurant } =
    useQuery({
      queryKey: ['managed-restaurant'],
      queryFn: getManagedRestaurant,
      staleTime: Infinity,
    })

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: Infinity,
  })

  const profile = profileData?.profile

  const { mutateAsync: createCheckoutFn, isPending } = useMutation({
    mutationFn: async ({ plan, metadata }: CreateCheckoutRequest) => {
      const { url } = await createCheckout({ plan, metadata })

      return url
    },
    onSuccess: (url) => {
      window.location.href = url
    },
  })

  async function handleUpgrade() {
    if (!managedRestaurant || !profile) return

    await createCheckoutFn({
      plan: selectedPlan,
      metadata: {
        restaurantId: managedRestaurant.restaurant.id,
        userId: profile.id,
        email: profile.email,
      },
    })
  }

  if (isLoadingProfile || isLoadingManagedRestaurant) return <UpgradeSkeleton />

  return (
    <>
      <Helmet title="Fazer upgrade" />

      <div className="flex min-h-[calc(100vh-150px)] items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Atualize seu plano</CardTitle>
            <CardDescription>
              Escolha o plano que melhor se encaixa no seu negócio
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4 sm:grid-cols-2">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isSelected={selectedPlan === plan.id}
                onSelect={() => setSelectedPlan(plan.id)}
              />
            ))}
          </CardContent>

          <CardFooter className="flex-col gap-3">
            <Button
              onClick={handleUpgrade}
              disabled={isPending}
              className="w-full bg-violet-500 text-white hover:bg-violet-600"
            >
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                'Atualizar agora'
              )}
            </Button>

            <p className="text-muted-foreground text-center text-xs">
              Pagamento seguro processado pelo Stripe
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
