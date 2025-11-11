import {
  ChartPie,
  Menu,
  Pizza,
  Settings,
  SquareChartGantt,
  Ticket,
  UtensilsCrossed,
} from 'lucide-react'
import { useState } from 'react'

import { AccountMenu } from './account-menu'
import { BrandIcon } from './icon/brand-icon'
import { NavLink } from './nav-link'
import { ModeToggle } from './theme-toggle'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-6 px-6">
        <div className="hidden lg:block">
          <NavLink to="/">
            <BrandIcon className="size-7 fill-violet-400" />
          </NavLink>
        </div>

        <Separator orientation="vertical" className="hidden h-6! lg:block" />

        <nav className="hidden items-center space-x-4 lg:flex lg:space-x-6">
          <NavLink to="/">
            <ChartPie className="size-4" />
            Dashboard
          </NavLink>

          <NavLink to="/orders">
            <UtensilsCrossed className="size-4" />
            Pedidos
          </NavLink>

          <NavLink to="/categories">
            <SquareChartGantt className="size-4" />
            Categorias
          </NavLink>

          <NavLink to="/products">
            <Pizza className="size-4" />
            Produtos
          </NavLink>

          <NavLink to="/coupons">
            <Ticket className="size-4" />
            Cupons
          </NavLink>

          <NavLink to="/settings">
            <Settings className="size-4" />
            Configurações
          </NavLink>
        </nav>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-64">
            <SheetHeader className="justify-start border-b">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col space-y-4 px-4">
              <NavLink to="/" onClick={() => setIsOpen(false)}>
                Dashboard
              </NavLink>

              <NavLink to="/orders" onClick={() => setIsOpen(false)}>
                Pedidos
              </NavLink>

              <NavLink to="/categories" onClick={() => setIsOpen(false)}>
                Categorias
              </NavLink>

              <NavLink to="/products" onClick={() => setIsOpen(false)}>
                Produtos
              </NavLink>

              <NavLink to="/coupons" onClick={() => setIsOpen(false)}>
                Cupons
              </NavLink>

              <NavLink to="/settings" onClick={() => setIsOpen(false)}>
                Configurações
              </NavLink>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="ml-auto flex items-center space-x-2">
          <ModeToggle />
          <AccountMenu />
        </div>
      </div>
    </div>
  )
}
