import { Loader2Icon } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

import { UpdateAddress } from './update-address'
import { OpeningHoursSettings } from './update-opening-hours'
import { UpdatePaymentMethods } from './update-payment-methods'
import { UpdateSegments } from './update-segments'

export function Settings() {
  return (
    <>
      <Helmet title="Categorias" />

      <div className="flex flex-col gap-4">
        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
          Configurações
          {false && (
            <Loader2Icon className="text-muted-foreground h-5 w-5 animate-spin" />
          )}
        </h1>

        <UpdateSegments />
        <UpdatePaymentMethods />
        <OpeningHoursSettings />
        <UpdateAddress />
      </div>
    </>
  )
}
