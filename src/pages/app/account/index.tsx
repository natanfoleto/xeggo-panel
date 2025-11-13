import { Helmet } from 'react-helmet-async'

import { AccountTabs } from './tabs'

export function Account() {
  return (
    <>
      <Helmet title="Conta" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 space-y-4 2xl:max-w-384">
        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
          Conta
        </h1>

        <AccountTabs />
      </div>
    </>
  )
}
