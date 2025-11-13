import { Helmet } from 'react-helmet-async'

import { DayOrdersAmountCard } from './day-orders-amount-card'
import { MonthCanceledOrdersAmountCard } from './month-canceled-orders-amount-card'
import { MonthOrdersAmountCard } from './month-orders-amount-card'
import { MonthReceiptCard } from './month-receipt-card'
import { PopularProductsChart } from './popular-products-chart'
import { ReceiptChart } from './receipt-chart'
import { RestaurantShareLink } from './restaurant-share-link'

export function Dashboard() {
  return (
    <>
      <Helmet title="Dashboard" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 2xl:max-w-384">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MonthReceiptCard />
          <MonthOrdersAmountCard />
          <DayOrdersAmountCard />
          <MonthCanceledOrdersAmountCard />
        </div>

        <div className="grid grid-cols-1 gap-y-4 xl:grid-cols-12 xl:gap-x-4">
          <ReceiptChart />
          <PopularProductsChart />
        </div>

        <RestaurantShareLink />
      </div>
    </>
  )
}
