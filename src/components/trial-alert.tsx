import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getSubscription } from '@/api/manager/subscriptions/get-subscription'

export function TrialAlert() {
  const navigate = useNavigate()

  const [daysLeft, setDaysLeft] = useState<number>(0)

  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: getSubscription,
  })

  useEffect(() => {
    if (!subscription?.trialEnd) return

    const trialEndDate = new Date(subscription.trialEnd)

    const calcDays = () => {
      const diff = trialEndDate.getTime() - Date.now()
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
      setDaysLeft(days)
    }

    calcDays()
    const interval = setInterval(calcDays, 1000 * 60 * 60)
    return () => clearInterval(interval)
  }, [subscription])

  if (!subscription?.trialEnd) return null

  return (
    <div className="bg-linear-to-r from-violet-500 to-violet-600 px-4 py-1.5 text-center text-white">
      <div className="text-sm font-medium">
        <span>Período de teste ativo • </span>
        <span>
          Expira em <b>{daysLeft}</b> {daysLeft === 1 ? 'dia' : 'dias'} •{' '}
        </span>
        <span
          className="cursor-pointer underline"
          onClick={() => navigate('/upgrade')}
        >
          Fazer upgrade
        </span>
      </div>
    </div>
  )
}
