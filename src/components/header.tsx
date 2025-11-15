import {
  ChartPie,
  Menu,
  Pizza,
  SquareChartGantt,
  Store,
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
    <div className="border-b px-6">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 2xl:max-w-384">
        <div className="hidden lg:block">
          <NavLink to="/">
            <span className="rounded-md bg-violet-500 p-1.5">
              <BrandIcon className="size-6 fill-white" />
            </span>
          </NavLink>
        </div>

        <Separator orientation="vertical" className="hidden h-4! lg:block" />

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

          <NavLink to="/restaurant">
            <Store className="size-4" />
            Restaurante
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

              <NavLink to="/restaurant" onClick={() => setIsOpen(false)}>
                Restaurante
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
