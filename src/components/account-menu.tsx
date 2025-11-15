import { useMutation, useQuery } from '@tanstack/react-query'
import {
  ChevronDown,
  CircleArrowUp,
  CircleQuestionMark,
  ClipboardCheck,
  LogOut,
  Settings,
  ShieldCheck,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { getProfile } from '@/api/manager/profile/get-profile'
import { signOut } from '@/api/public/authentication/sign-out'

import { Button } from './ui/button'
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
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: Infinity,
  })

  const profile = profileData?.profile

  const { isPending: isSigningOut, mutateAsync: handleSignOut } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      navigate('/sign-in', { replace: true })
    },
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 select-none"
        >
          {isLoadingProfile ? <Skeleton className="h-4 w-40" /> : profile?.name}
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          {isLoadingProfile ? (
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
            </div>
          ) : (
            <span className="text-muted-foreground text-xs font-normal">
              {profile?.email}
            </span>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <button
              type="button"
              className="text-muted-foreground flex w-full items-center gap-2"
              onClick={() => navigate('settings')}
            >
              <Settings className="mr-1 size-4" />
              <span>Configurações</span>
            </button>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <button
              type="button"
              className="text-muted-foreground flex w-full items-center gap-2"
            >
              <CircleQuestionMark className="mr-1 size-4" />
              <span>Receber ajuda</span>
            </button>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <button
              type="button"
              className="text-muted-foreground flex w-full items-center gap-2"
              onClick={() => navigate('/upgrade')}
            >
              <CircleArrowUp className="mr-1 size-4" />
              <span>Fazer upgrade do plano</span>
            </button>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <button
              type="button"
              className="text-muted-foreground flex w-full items-center gap-2"
            >
              <ClipboardCheck className="mr-1 size-4" />
              <span>Política de uso</span>
            </button>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <button
              type="button"
              className="text-muted-foreground flex w-full items-center gap-2"
            >
              <ShieldCheck className="mr-1 size-4" />
              <span>Política privacidade</span>
            </button>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild disabled={isSigningOut}>
            <button
              className="text-muted-foreground w-full"
              onClick={() => handleSignOut()}
              type="button"
            >
              <LogOut className="mr-1 size-4" />
              <span>Sair</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
