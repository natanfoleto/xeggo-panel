import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'

import type { Plan } from './plans'

interface PlanCardProps {
  plan: Plan
  isSelected: boolean
  onSelect: () => void
}

export function PlanCard({ plan, isSelected, onSelect }: PlanCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'relative rounded-lg border p-6 text-left transition-all hover:border-violet-400',
        isSelected
          ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/20'
          : 'border-muted',
      )}
    >
      {plan.badge && (
        <div className="absolute -top-3 right-1/2 hidden translate-x-1/2 sm:block">
          <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
            {plan.badge}
          </span>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold">{plan.name}</h3>
          <p className="text-muted-foreground text-sm">{plan.description}</p>
        </div>

        <div>
          <span className="text-3xl font-bold">{plan.price.split(',')[0]}</span>

          <span className="text-muted-foreground">
            ,{plan.price.split(',')[1]}
          </span>

          {plan.equivalentPrice && (
            <p className="text-sm text-green-600 dark:text-green-400">
              {plan.equivalentPrice}
            </p>
          )}
        </div>

        <ul className="space-y-2">
          {plan.benefits.map((benefit, index) => (
            <li
              key={index}
              className={cn(
                'flex items-center gap-2 text-sm',
                benefit.highlight &&
                  'font-medium text-green-600 dark:text-green-400',
              )}
            >
              <Check className="size-4 text-violet-500" />
              {benefit.text}
            </li>
          ))}
        </ul>
      </div>

      {isSelected && (
        <div className="absolute top-3 right-3">
          <div className="flex size-5 items-center justify-center rounded-full bg-violet-500">
            <Check className="size-3.5 text-white" />
          </div>
        </div>
      )}
    </button>
  )
}
