import { useQuery } from '@tanstack/react-query'
import { addDays, differenceInDays, isBefore, parseISO } from 'date-fns'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getSubscription } from '@/api/manager/subscriptions/get-subscription'
import { env } from '@/env'

export function SubscriptionAlert() {
  const navigate = useNavigate()

  const navigateToPlans = () => navigate('/settings?tab=plans')

  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: getSubscription,
  })

  const [daysLeft, setDaysLeft] = useState<number | null>(null)

  useEffect(() => {
    if (!subscription) return

    if (subscription.status !== 'past_due') return setDaysLeft(null)

    const updatedAt = parseISO(subscription.updatedAt)

    const graceEndDate = addDays(updatedAt, env.VITE_GRACE_PERIOD_DAYS)

    const calcDays = () => {
      if (isBefore(graceEndDate, new Date())) return setDaysLeft(0)

      const diff = differenceInDays(graceEndDate, new Date())

      setDaysLeft(diff)
    }

    calcDays()

    const interval = setInterval(calcDays, 1000 * 60 * 60)

    return () => clearInterval(interval)
  }, [subscription])

  if (!subscription || subscription.status === 'active') return null

  if (subscription.status === 'past_due') {
    return (
      <div className="bg-linear-to-r from-red-400 to-red-500 px-4 py-1.5 text-center text-white">
        <div className="text-sm font-medium">
          <span>Pagamento pendente • </span>

          {daysLeft !== null && daysLeft >= 0 && (
            <span>
              Faltam <b>{daysLeft}</b> {daysLeft === 1 ? 'dia' : 'dias'} para
              suspensão do serviço •{' '}
            </span>
          )}

          <span className="cursor-pointer underline" onClick={navigateToPlans}>
            Atualizar pagamento
          </span>
        </div>
      </div>
    )
  }

  if (
    subscription.status === 'incomplete' ||
    subscription.status === 'canceled'
  ) {
    return (
      <div className="bg-linear-to-r from-red-400 to-red-500 px-4 py-1.5 text-center text-white">
        <div className="text-sm font-medium">
          <span>Assinatura inativa • </span>

          <span className="cursor-pointer underline" onClick={navigateToPlans}>
            Reativar assinatura
          </span>
        </div>
      </div>
    )
  }

  return null
}
