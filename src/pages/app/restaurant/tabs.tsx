import { useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { UpdateAddress } from './tabs/address'
import { UpdateAsaasAccount } from './tabs/asaas-account'
import { UpdateDeliverySettings } from './tabs/delivery-settings'
import { OpeningHoursSettings } from './tabs/opening-hours'
import { UpdatePaymentMethods } from './tabs/payment-methods'
import { UpdateRestaurant } from './tabs/restaurant'
import { UpdateSegments } from './tabs/segments'

const tabs = [
  { id: 'geral', title: 'Geral' },
  { id: 'address', title: 'Endereço' },
  { id: 'segments', title: 'Segmentos' },
  { id: 'payment-methods', title: 'Métodos de pagamento' },
  { id: 'update-delivery', title: 'Configurações de entrega' },
  { id: 'opening-hours', title: 'Horários de funcionamento' },
  { id: 'online-payments', title: 'Pagamentos online' },
] as const

type TabId = (typeof tabs)[number]['id']

export function RestaurantTabs() {
  const [searchParams, setSearchParams] = useSearchParams()

  const activeTab = (searchParams.get('tab') as TabId) || 'geral'

  const handleTabChange = (tabId: TabId) => {
    setSearchParams({ tab: tabId })
  }

  return (
    <div className="flex flex-col gap-6 md:flex-row">
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
        {activeTab === 'geral' && <UpdateRestaurant />}
        {activeTab === 'address' && <UpdateAddress />}
        {activeTab === 'segments' && <UpdateSegments />}
        {activeTab === 'payment-methods' && <UpdatePaymentMethods />}
        {activeTab === 'update-delivery' && <UpdateDeliverySettings />}
        {activeTab === 'opening-hours' && <OpeningHoursSettings />}
        {activeTab === 'online-payments' && <UpdateAsaasAccount />}
      </div>
    </div>
  )
}
