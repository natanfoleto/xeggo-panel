import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

import { authenticateFromGoogle } from '@/api/public/authentication/authenticate-from-google'
import { authenticateFromLink } from '@/api/public/authentication/authenticate-from-link'
import { appalert } from '@/components/app-alert/app-alert-context'
import { GoogleIcon } from '@/components/icon/google-icon'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const signInSchema = z.object({
  email: z.string().email(),
})

type SignInSchema = z.infer<typeof signInSchema>

export function SignIn() {
  const [searchParams] = useSearchParams()

  const email = searchParams.get('email') ?? ''

  const [showEmailForm, setShowEmailForm] = useState(!!email)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email,
    },
  })

  const { mutateAsync: authenticateFromLinkFn } = useMutation({
    mutationFn: authenticateFromLink,
  })

  async function onSubmit({ email }: SignInSchema) {
    await authenticateFromLinkFn({ email })

    appalert.info(
      'Excelente',
      'Enviamos um link de autenticação para seu e-mail.',
    )
  }

  return (
    <div className="px-8 lg:p-8">
      <a
        href="/sign-up"
        className={twMerge(
          buttonVariants({ variant: 'ghost' }),
          'absolute top-8 right-8',
        )}
      >
        Novo restaurante
      </a>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Acessar painel
          </h1>
          <p className="text-muted-foreground text-sm">
            Acompanhe suas vendas pelo painel do parceiro!
          </p>
        </div>

        <div className="grid gap-6">
          {showEmailForm ? (
            <div className="grid gap-4">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Seu e-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      {...register('email')}
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting}>
                    Acessar painel
                  </Button>
                </div>
              </form>

              <Button
                type="button"
                variant="link"
                onClick={() => setShowEmailForm(false)}
                className="text-muted-foreground"
              >
                Outras opções de login
              </Button>
            </div>
          ) : (
            <div className="grid gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEmailForm(true)}
              >
                <Mail />
                Continuar com e-mail
              </Button>

              <Button
                onClick={() => authenticateFromGoogle()}
                variant="secondary"
              >
                <GoogleIcon />
                Continuar com Google
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
