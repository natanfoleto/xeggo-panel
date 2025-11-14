import { useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { Account } from './account'
import { Notifications } from './notifications'
import { Plans } from './plans'
import { UpdateProfile } from './update-profile'
import { Usage } from './usage'

const tabs = [
  { id: 'geral', title: 'Geral' },
  { id: 'account', title: 'Conta' },
  { id: 'plans', title: 'Planos e cobranças' },
  { id: 'usage', title: 'Limites de uso' },
  { id: 'notifications', title: 'Preferências de notificação' },
] as const

type TabId = (typeof tabs)[number]['id']

export function SettingsTabs() {
  const [searchParams, setSearchParams] = useSearchParams()

  const activeTab = (searchParams.get('tab') as TabId) || 'geral'

  const handleTabChange = (tabId: TabId) => {
    setSearchParams({ tab: tabId })
  }

  return (
    <div className="flex gap-6">
      <aside className="bg-card flex h-min flex-col gap-1.5 rounded-xl border p-5">
        {tabs.map((tab) => {
          return (
            <Button
              type="button"
              key={tab.id}
              variant="ghost"
              className={cn(
                'justify-start text-sm hover:bg-violet-100! hover:text-violet-700 dark:hover:bg-violet-900/30! dark:hover:text-violet-400',
                {
                  'bg-violet-100 text-violet-700 hover:bg-violet-100 dark:bg-violet-900/30 dark:text-violet-400':
                    activeTab === tab.id,
                },
              )}
              onClick={() => handleTabChange(tab.id)}
              aria-selected={activeTab === tab.id}
            >
              {tab.title}
            </Button>
          )
        })}
      </aside>

      <div className="flex w-full flex-col gap-8 overflow-auto">
        {activeTab === 'geral' && <UpdateProfile />}
        {activeTab === 'account' && <Account />}
        {activeTab === 'plans' && <Plans />}
        {activeTab === 'usage' && <Usage />}
        {activeTab === 'notifications' && <Notifications />}
      </div>
    </div>
  )
}
