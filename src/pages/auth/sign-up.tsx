import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

import { registerRestaurant } from '@/api/public/restaurants/register-restaurant'
import { appalert } from '@/components/app-alert/app-alert-context'
import { FormCpfCnpjInput } from '@/components/form/form-cpf-cnpj-input'
import { FormInput } from '@/components/form/form-input'
import { FormPhoneInput } from '@/components/form/form-phone-input'
import { Button, buttonVariants } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { isValidCNPJ, isValidCPF } from '@/utils/validate-document'

const signUpSchema = z.object({
  restaurantName: z
    .string()
    .min(1, { message: 'Informe o nome do restaurante' }),
  cpfCnpj: z
    .string()
    .min(11, 'Documento inválido')
    .max(14, 'Documento inválido')
    .refine(
      (value) => {
        const only = value.replace(/\D/g, '')

        return only.length === 11 ? isValidCPF(only) : isValidCNPJ(only)
      },
      { message: 'CPF ou CNPJ inválido' },
    ),
  managerName: z.string().min(1, { message: 'Informe o nome do proprietário' }),
  phone: z.string(),
  email: z.string().email({ message: 'Informe um e-mail válido' }),
})

type SignUpSchema = z.infer<typeof signUpSchema>

export function SignUp() {
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
      cpfCnpj: '',
      managerName: '',
      email: '',
      phone: '',
    },
  })

  const { mutateAsync: registerRestaurantFn } = useMutation({
    mutationFn: registerRestaurant,
  })

  async function onSubmit({
    restaurantName,
    cpfCnpj,
    managerName,
    email,
    phone,
  }: SignUpSchema) {
    await registerRestaurantFn({
      restaurantName,
      cpfCnpj,
      managerName,
      email,
      phone,
    })

    appalert.success(
      'Restaurante cadastrado',
      'Faça login e acesse o painel do parceiro.',
    )
  }

  return (
    <div className="lg:p-8">
      <a
        href="/sign-in"
        className={twMerge(
          buttonVariants({ variant: 'ghost' }),
          'absolute top-8 right-8',
        )}
      >
        Fazer login
      </a>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 px-8 sm:w-[350px] sm:px-0">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Criar conta grátis
          </h1>
          <p className="text-muted-foreground text-sm">
            Seja um parceiro <span className="font-semibold">xeggo</span> e
            comece suas vendas!
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do negócio</Label>
              <FormInput
                id="name"
                type="text"
                placeholder="Nome do estabelecimento"
                autoCorrect="off"
                {...register('restaurantName')}
                error={errors.restaurantName?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpfCnpj">CPF ou CNPJ</Label>
              <FormCpfCnpjInput
                value={watch('cpfCnpj')}
                onChange={(value) =>
                  setValue('cpfCnpj', value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                disabled={isSubmitting}
                error={errors.cpfCnpj?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="managerName">Seu nome</Label>
              <FormInput
                id="managerName"
                type="text"
                placeholder="Dono do restaurante"
                autoCorrect="off"
                {...register('managerName')}
                error={errors.managerName?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Seu e-mail</Label>
              <FormInput
                id="email"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                placeholder="Seu melhor e-mail"
                autoCorrect="off"
                {...register('email')}
                error={errors.email?.message}
              />
            </div>

            <div className="space-y-2">
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
