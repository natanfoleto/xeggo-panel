import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

import { RegisterRestaurant } from '@/api/restaurants/register-restaurant'
import { appalert } from '@/components/app-alert/app-alert-context'
import { FormInput } from '@/components/form/form-input'
import { FormPhoneInput } from '@/components/form/form-phone-input'
import { Button, buttonVariants } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const signUpSchema = z.object({
  restaurantName: z
    .string()
    .min(1, { message: 'Informe o nome do restaurante' }),
  managerName: z.string().min(1, { message: 'Informe o nome do proprietário' }),
  phone: z.string(),
  email: z.string().email({ message: 'Informe um e-mail válido' }),
})

type SignUpSchema = z.infer<typeof signUpSchema>

export function SignUp() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      restaurantName: '',
      managerName: '',
      email: '',
      phone: '',
    },
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
    await registerRestaurant({ restaurantName, managerName, email, phone })

    appalert.success(
      'Restaurante cadastrado',
      'Clique no botão a baixo para fazer login.',
      {
        action: {
          label: 'Login',
          onClick: () => {
            navigate(`/sign-in?email=${email}`)
          },
        },
        onDismiss: () => {
          navigate(`/sign-in?email=${email}`)
        },
      },
    )
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
                <FormInput
                  id="name"
                  type="text"
                  autoCorrect="off"
                  {...register('restaurantName')}
                  error={errors.restaurantName?.message}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="managerName">Seu nome</Label>
                <FormInput
                  id="managerName"
                  type="text"
                  autoCorrect="off"
                  {...register('managerName')}
                  error={errors.managerName?.message}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Seu e-mail</Label>
                <FormInput
                  id="email"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  {...register('email')}
                  error={errors.email?.message}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Celular</Label>
                <FormPhoneInput
                  value={watch('phone')}
                  onChange={(value) =>
                    setValue('phone', value, { shouldDirty: true })
                  }
                  disabled={isSubmitting}
                  error={errors.phone?.message}
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
