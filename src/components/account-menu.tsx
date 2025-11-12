import { useMutation, useQuery } from '@tanstack/react-query'
import { Building, ChevronDown, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { getProfile } from '@/api/manager/profile/get-profile'
import { getManagedRestaurant } from '@/api/manager/restaurants/get-managed-restaurant'
import { signOut } from '@/api/public/authentication/sign-out'

import { RestaurantProfile } from './restaurant-profile'
import { Button } from './ui/button'
import { Dialog, DialogTrigger } from './ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Skeleton } from './ui/skeleton'

export function AccountMenu() {
  const navigate = useNavigate()

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['me'],
    queryFn: getProfile,
    staleTime: Infinity,
  })

  const profile = profileData?.profile

  const { data: managedRestaurant, isLoading: isLoadingManagedRestaurant } =
    useQuery({
      queryKey: ['managed-restaurant'],
      queryFn: getManagedRestaurant,
      staleTime: Infinity,
    })

  const { isPending: isSigningOut, mutateAsync: handleSignOut } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      navigate('/sign-in', { replace: true })
    },
  })

  const restaurant = managedRestaurant?.restaurant

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 select-none"
          >
            {isLoadingManagedRestaurant ? (
              <Skeleton className="h-4 w-40" />
            ) : (
              restaurant?.name
            )}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col">
            {isLoadingProfile ? (
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            ) : (
              <>
                {profile?.name}
                <span className="text-muted-foreground text-xs font-normal">
                  {profile?.email}
                </span>
              </>
            )}
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center gap-2"
                >
                  <Building className="mr-2 h-4 w-4" />
                  <span>Perfil da loja</span>
                </button>
              </DialogTrigger>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className="text-rose-500 dark:text-rose-400"
              disabled={isSigningOut}
            >
              <button
                className="w-full"
                onClick={() => handleSignOut()}
                type="button"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <RestaurantProfile />
    </Dialog>
  )
}
