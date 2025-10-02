import { Pizza } from 'lucide-react'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="relative container hidden min-h-screen flex-col items-center justify-center antialiased md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="border-foreground/5 bg-muted text-muted-foreground relative hidden h-full flex-col border-r p-10 lg:flex dark:border-r">
        <div className="text-foreground flex items-center gap-3 text-lg font-medium">
          <Pizza className="h-5 w-5" />
          <span className="font-semibold">xeggo</span>
        </div>
        <div className="mt-auto">
          <footer className="text-sm">
            Painel do parceiro &copy; xeggo - {new Date().getFullYear()}
          </footer>
        </div>
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center">
        <Outlet />
      </div>
    </div>
  )
}
