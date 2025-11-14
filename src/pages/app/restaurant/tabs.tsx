import { useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { UpdateDeliverySettings } from './delivery-settings'
import { UpdateAddress } from './update-address'
import { OpeningHoursSettings } from './update-opening-hours'
import { UpdatePaymentMethods } from './update-payment-methods'
import { UpdateProfile } from './update-profile'
import { UpdateSegments } from './update-segments'

const tabs = [
  { id: 'profile', title: 'Perfil' },
  { id: 'address', title: 'Endereço' },
  { id: 'segments', title: 'Segmentos' },
  { id: 'payment-methods', title: 'Métodos de pagamento' },
  { id: 'update-delivery', title: 'Configurações de entrega' },
  { id: 'opening-hours', title: 'Horários de funcionamento' },
] as const

type TabId = (typeof tabs)[number]['id']

export function RestaurantTabs() {
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
        {activeTab === 'profile' && <UpdateProfile />}
        {activeTab === 'address' && <UpdateAddress />}
        {activeTab === 'segments' && <UpdateSegments />}
        {activeTab === 'payment-methods' && <UpdatePaymentMethods />}
        {activeTab === 'update-delivery' && <UpdateDeliverySettings />}
        {activeTab === 'opening-hours' && <OpeningHoursSettings />}
      </div>
    </div>
  )
}
