import { Helmet } from 'react-helmet-async'

import { UpdateDeliverySettings } from './delivery-settings'
import { UpdateAddress } from './update-address'
import { OpeningHoursSettings } from './update-opening-hours'
import { UpdatePaymentMethods } from './update-payment-methods'
import { UpdateProfile } from './update-profile'
import { UpdateSegments } from './update-segments'

export function Settings() {
  return (
    <>
      <Helmet title="Configurações" />

      <div className="flex flex-col gap-4">
        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
          Configurações
        </h1>

        <UpdateProfile />
        <UpdateAddress />
        <UpdateSegments />
        <UpdatePaymentMethods />
        <UpdateDeliverySettings />
        <OpeningHoursSettings />
      </div>
    </>
  )
}
