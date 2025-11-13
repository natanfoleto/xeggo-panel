import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'geral', title: 'Geral' },
  { id: 'account', title: 'Conta' },
  { id: 'billing', title: 'Banners' },
  { id: 'usage', title: 'Uso' },
  { id: 'capacity', title: 'Capacidade' },
] as const

type TabId = (typeof tabs)[number]['id']

export function AccountTabs() {
  const [activeTab, setActiveTab] = useState<TabId>('geral')

  return (
    <div className="flex gap-12">
      <aside className="flex w-64 flex-col gap-1.5">
        {tabs.map((tab) => {
          return (
            <Button
              type="button"
              key={tab.id}
              variant="ghost"
              className={cn('hover:bg-muted justify-start text-sm', {
                'bg-muted': activeTab === tab.id,
                '': activeTab !== tab.id,
              })}
              onClick={() => setActiveTab(tab.id)}
              aria-selected={activeTab === tab.id}
            >
              {tab.title}
            </Button>
          )
        })}
      </aside>

      <div className="flex w-full flex-col gap-8 overflow-auto">
        {activeTab === 'geral' && <div>Geral</div>}
        {activeTab === 'account' && <div>Conta</div>}
        {activeTab === 'billing' && <div>Cobranças</div>}
        {activeTab === 'usage' && <div>Uso</div>}
        {activeTab === 'capacity' && <div>Capacidade</div>}
      </div>
    </div>
  )
}
