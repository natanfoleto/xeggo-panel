import { useMutation, useQuery } from '@tanstack/react-query'
import { ClipboardList, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { getProfile } from '@/api/manager/profile/get-profile'
import { signOut } from '@/api/public/authentication/sign-out'
import { appalert } from '@/components/app-alert/app-alert-context'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function Account() {
  const navigate = useNavigate()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })

  const { isPending: isSigningOut, mutateAsync: handleSignOut } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      navigate('/sign-in', { replace: true })
    },
  })

  const handleCopyProfileId = async () => {
    if (!profile) return

    await navigator.clipboard.writeText(profile.id)

    appalert.success(
      'ID copiado',
      'Envie para o suporte em caso de necessidade.',
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Conta</CardTitle>

        <CardDescription>Informações da sua conta</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6 text-sm">
          <div className="flex items-center justify-between gap-2">
            <span>Apagar conta</span>
            <span className="cursor-pointer underline">Contatar suporte</span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-between gap-2">
              <span>ID da conta</span>
              <span className="bg-muted text-muted-foreground flex w-60 animate-pulse items-center gap-2 rounded-md py-3" />
            </div>
          ) : (
            profile && (
              <div className="flex items-center justify-between gap-2">
                <span>ID da conta</span>

                <span className="bg-muted text-muted-foreground flex items-center gap-2 rounded-md px-2 py-1">
                  {profile.id}
                  <ClipboardList
                    onClick={handleCopyProfileId}
                    className="text-foreground size-4 cursor-pointer"
                  />
                </span>
              </div>
            )
          )}

          <Button
            variant="destructive"
            disabled={isSigningOut}
            onClick={() => handleSignOut()}
          >
            <LogOut className="mr-1 size-4" />
            Sair
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
