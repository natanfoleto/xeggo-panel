import { Outlet } from 'react-router-dom'

import { BrandIcon } from '@/components/icon/brand-icon'

export function AuthLayout() {
  return (
    <div className="relative min-h-screen flex-col items-center antialiased md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-linear-to-r from-violet-800 to-violet-600 p-10 lg:flex">
        <div className="text-foreground flex items-center gap-3 text-lg font-medium">
          <span className="font-semibold text-zinc-100">
            <BrandIcon className="size-6 fill-white" />
          </span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-zinc-100">
          <BrandIcon className="size-20 fill-white" />

          <div className="text-center">
            <h1 className="text-3xl">
              O controle do seu negócio na palma da mão
            </h1>

            <p className="text-lg">Menos burocracia, mais resultados</p>
          </div>
        </div>

        <div className="mt-auto">
          <footer className="text-sm text-zinc-100">
            Painel do parceiro &copy; xeggo - {new Date().getFullYear()}
          </footer>
        </div>
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center gap-2">
        <BrandIcon className="size-12 fill-white lg:hidden" />
        <Outlet />
      </div>
    </div>
  )
}
