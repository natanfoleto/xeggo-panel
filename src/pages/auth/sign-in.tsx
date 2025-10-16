import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

import { signIn } from '@/api/auth/sign-in'
import { signInWithGoogle } from '@/api/auth/sign-in-with-google'
import { GoogleIcon } from '@/components/google-icon'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const signInSchema = z.object({
  email: z.string().email(),
})

type SignInSchema = z.infer<typeof signInSchema>

export function SignIn() {
  const [searchParams] = useSearchParams()
  const [showEmailForm, setShowEmailForm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
    },
  })

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  })

  async function handleAuthenticate({ email }: SignInSchema) {
    try {
      await authenticate({ email })

      toast.success('Enviamos um link de autenticação para seu e-mail.', {
        action: {
          label: 'Reenviar',
          onClick: () => authenticate({ email }),
        },
      })
    } catch (err) {
      toast.error('Credenciais inválidas')
    }
  }

  return (
    <div className="lg:p-8">
      <a
        href="/sign-up"
        className={twMerge(
          buttonVariants({ variant: 'ghost' }),
          'absolute top-4 right-4 md:top-8 md:right-8',
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
              <form onSubmit={handleSubmit(handleAuthenticate)}>
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

              <Button onClick={signInWithGoogle} variant="secondary">
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
