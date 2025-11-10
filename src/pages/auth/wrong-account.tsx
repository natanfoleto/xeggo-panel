import { AlertCircle } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

import { authenticateFromGoogle } from '@/api/public/authentication/authenticate-from-google'
import { GoogleIcon } from '@/components/icon/google-icon'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function WrongAccount() {
  return (
    <>
      <Helmet title="Conta incorreta" />

      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2">
              <AlertCircle className="size-6 text-red-600 dark:text-red-400" />
            </div>

            <CardTitle>Conta não autorizada</CardTitle>

            <CardDescription>
              A conta que você usou está cadastrada como cliente. Para acessar o
              painel administrativo, você precisa usar uma conta de gerente.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <h3 className="mb-2 text-sm font-medium">O que fazer?</h3>

              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Use outro email do Google</li>
                <li>• Ou crie uma nova conta de gerente</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => authenticateFromGoogle({ selectAccount: true })}
                className="w-full"
                variant="secondary"
              >
                <GoogleIcon />
                Usar outra conta Google
              </Button>

              <Button
                variant="link"
                className="text-muted-foreground w-full"
                onClick={() => (window.location.href = '/sign-in')}
              >
                Voltar para login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
