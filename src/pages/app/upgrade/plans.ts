export interface PlanBenefit {
  text: string
  highlight?: boolean
}

export interface Plan {
  id: 'monthly' | 'annual'
  name: string
  description: string
  price: string
  period: string
  equivalentPrice?: string
  badge?: string
  benefits: PlanBenefit[]
}

export const plans: Plan[] = [
  {
    id: 'monthly',
    name: 'Mensal',
    description: 'Ideal para começar',
    price: 'R$ 99,90',
    period: '/mês',
    benefits: [
      { text: 'App de pedidos completo' },
      { text: 'Painel administrativo' },
      { text: 'Sem economia' },
    ],
  },
  {
    id: 'annual',
    name: 'Anual',
    description: 'Melhor custo-benefício',
    price: 'R$ 1.018,90',
    period: '/ano',
    equivalentPrice: 'R$ 84,90/mês',
    badge: 'Economize 15%',
    benefits: [
      { text: 'App de pedidos completo' },
      { text: 'Painel administrativo' },
      { text: 'Economize R$ 179,90/ano', highlight: true },
    ],
  },
]
