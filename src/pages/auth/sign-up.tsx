import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

import { RegisterRestaurant } from '@/api/register-restaurant'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const signUpSchema = z.object({
  restaurantName: z.string(),
  managerName: z.string(),
  phone: z.string(),
  email: z.string().email(),
})

type SignUpSchema = z.infer<typeof signUpSchema>

export function SignUp() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  })

  const { mutateAsync: registerRestaurant } = useMutation({
    mutationFn: RegisterRestaurant,
  })

  async function handleRegisteRestaurant({
    restaurantName,
    managerName,
    email,
    phone,
  }: SignUpSchema) {
    try {
      await registerRestaurant({ restaurantName, managerName, email, phone })

      toast.success('Restaurante cadastrado!', {
        description: '',
        action: {
          label: 'Login',
          onClick: () => {
            navigate(`/sign-in?email=${email}`)
          },
        },
      })
    } catch (err) {
      toast.error('Erro ao registrar restaurante!')
    }
  }

  return (
    <div className="lg:p-8">
      <a
        href="/sign-in"
        className={twMerge(
          buttonVariants({ variant: 'ghost' }),
          'absolute top-4 right-4 md:top-8 md:right-8',
        )}
      >
        Fazer login
      </a>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Criar conta grátis
          </h1>
          <p className="text-muted-foreground text-sm">
            Seja um parceiro <span className="font-semibold">xeggo</span> e
            comece suas vendas!
          </p>
        </div>

        <div className="grid gap-6">
          <form onSubmit={handleSubmit(handleRegisteRestaurant)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome do negócio</Label>
                <Input
                  id="name"
                  type="text"
                  autoCorrect="off"
                  {...register('restaurantName')}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="managerName">Seu nome</Label>
                <Input
                  id="managerName"
                  type="text"
                  autoCorrect="off"
                  {...register('managerName')}
                />
              </div>

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

              <div className="grid gap-2">
                <Label htmlFor="phone">Celular</Label>
                <Input
                  id="phone"
                  placeholder="(99) 99999-9999"
                  type="tel"
                  {...register('phone')}
                />
              </div>

              <Button type="submit" disabled={isSubmitting}>
                Finalizar cadastro
              </Button>
            </div>
          </form>
        </div>

        <p className="text-muted-foreground px-6 text-center text-sm leading-relaxed">
          Ao continuar, você concorda com nossos{' '}
          <a
            href="/terms"
            className="hover:text-primary underline underline-offset-4"
          >
            Termos de serviço
          </a>{' '}
          e{' '}
          <a
            href="/privacy"
            className="hover:text-primary underline underline-offset-4"
          >
            Políticas de privacidade
          </a>
          .
        </p>
      </div>
    </div>
  )
}
