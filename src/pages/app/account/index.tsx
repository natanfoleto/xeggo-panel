import { Helmet } from 'react-helmet-async'

export function Account() {
  return (
    <>
      <Helmet title="Conta" />

      <div className="flex flex-col gap-4">
        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
          Conta
        </h1>
      </div>
    </>
  )
}
