// src/pages/app/restaurant/tabs/asaas-account/asaas-create-form.tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { getAddressByCep } from '@/api/manager/addresses/get-address-by-cep'
import { createAsaasAccount } from '@/api/manager/restaurants/asaas/create-asaas-account'
import { appalert } from '@/components/app-alert/app-alert-context'
import { FormCpfCnpjInput } from '@/components/form/form-cpf-cnpj-input'
import { FormInput } from '@/components/form/form-input'
import { FormPhoneInput } from '@/components/form/form-phone-input'
import { FormPriceInput } from '@/components/form/form-price-input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { queryClient } from '@/lib/react-query'
import { formatCEP } from '@/utils/format-cep'
import { formatCurrency } from '@/utils/format-currency'
import { isValidCNPJ, isValidCPF } from '@/utils/validate-document'

const createAccountSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  loginEmail: z.string().email('Email de login inválido').optional(),
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
  birthDate: z.string().optional(),
  mobilePhone: z
    .string()
    .min(10, 'Telefone inválido')
    .regex(/^\d+$/, 'Apenas números'),
  phone: z.string().optional(),
  incomeValue: z.number().positive('Faturamento deve ser maior que 0'),
  address: z.string().min(1, 'Endereço é obrigatório'),
  addressNumber: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  province: z.string().min(1, 'Bairro é obrigatório'),
  postalCode: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, 'CEP inválido (formato: 00000-000)')
    .or(z.literal('')),
  site: z.string().url('URL inválida').optional().or(z.literal('')),
})

export type CreateAccountSchema = z.infer<typeof createAccountSchema>

export interface AsaasCreateFormProps {
  defaultValues?: CreateAccountSchema
  onCancel: () => void
  onSuccess: () => void
}

export function AsaasCreateForm({
  defaultValues,
  onCancel,
  onSuccess,
}: AsaasCreateFormProps) {
  const [isSearchingCep, setIsSearchingCep] = useState(false)

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAccountSchema>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      name: '',
      email: '',
      cpfCnpj: '',
      mobilePhone: '',
      incomeValue: 1000000,
      address: '',
      addressNumber: '',
      province: '',
      postalCode: '',
    },
  })

  const postalCode = watch('postalCode')
  const incomeValue = watch('incomeValue')

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
    }
  }, [defaultValues, reset])

  const { mutateAsync: createAsaasAccountFn, isPending: isCreating } =
    useMutation({
      mutationFn: createAsaasAccount,
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['asaas-account'],
        })

        appalert.success(
          'Conta criada!',
          'Sua conta Asaas foi criada com sucesso. Agora você pode receber pagamentos online.',
        )

        onSuccess()
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          const data = error.response?.data
          const firstError = data?.errors?.[0]?.description

          if (data.code === 'invalid_object') {
            return appalert.error(
              'Dados inválidos',
              firstError ?? data?.message ?? 'Erro inesperado.',
            )
          }

          appalert.error(firstError ?? data?.message ?? 'Erro inesperado.')
        } else {
          appalert.error('Erro inesperado.')
        }
      },
    })

  const { mutateAsync: getAddressByCepFn } = useMutation({
    mutationFn: getAddressByCep,
  })

  const onSubmit = async (data: CreateAccountSchema) => {
    await createAsaasAccountFn({
      ...data,
      incomeValue: data.incomeValue / 100,
    })
  }

  const handleZipCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(event.target.value)
    setValue('postalCode', formatted)
  }

  const handlePostalCodeBlur = async () => {
    if (!postalCode || postalCode.replace(/\D/g, '').length !== 8) return

    setIsSearchingCep(true)

    try {
      const addressData = await getAddressByCepFn(postalCode)

      if (!addressData) return

      setValue('address', addressData.street, { shouldDirty: true })
      setValue('province', addressData.neighborhood, { shouldDirty: true })

      if (addressData.complement) {
        setValue('complement', addressData.complement, { shouldDirty: true })
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
    } finally {
      setIsSearchingCep(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-lg border p-6"
    >
      <h3 className="font-semibold">Criar nova conta</h3>

      <div className="space-y-4">
        <h3 className="text-muted-foreground text-sm">
          Dados do estabelecimento
        </h3>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do estabelecimento</Label>
            <FormInput
              id="name"
              placeholder="Pizzaria do João"
              {...register('name')}
              error={errors.name?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <FormInput
              id="email"
              type="email"
              placeholder="contato@pizzaria.com"
              {...register('email')}
              error={errors.email?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loginEmail">E-mail de login (opcional)</Label>
            <FormInput
              id="loginEmail"
              type="email"
              placeholder="Se vazio, usa o email principal"
              {...register('loginEmail')}
              error={errors.loginEmail?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="site">Site (opcional)</Label>
            <FormInput
              id="site"
              type="url"
              placeholder="https://pizzariadojoao.com.br"
              {...register('site')}
              error={errors.site?.message}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-muted-foreground text-sm">Dados fiscais</h3>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
              disabled={isCreating}
              error={errors.cpfCnpj?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Data de nascimento (opcional)</Label>
            <FormInput
              id="birthDate"
              type="date"
              {...register('birthDate')}
              error={errors.birthDate?.message}
            />
            <p className="text-muted-foreground text-xs">
              Obrigatório somente quando Pessoa Física
            </p>
          </div>

          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="incomeValue">Faturamento mensal estimado</Label>
            <FormPriceInput
              value={watch('incomeValue') ?? 0}
              onChange={(value) =>
                setValue('incomeValue', value, {
                  shouldDirty: true,
                })
              }
              error={errors.incomeValue?.message}
            />
            <p className="text-muted-foreground text-xs">
              Valor aproximado:{' '}
              {formatCurrency(incomeValue ? incomeValue / 100 : 0)}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-muted-foreground text-sm">Contato</h3>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="mobilePhone">Celular</Label>
            <FormPhoneInput
              value={watch('mobilePhone')}
              onChange={(value) =>
                setValue('mobilePhone', value, {
                  shouldDirty: true,
                })
              }
              error={errors.mobilePhone?.message}
            />
            <p className="text-muted-foreground text-xs">
              Apenas números com DDD
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone fixo (opcional)</Label>
            <FormPhoneInput
              value={watch('phone')}
              onChange={(value) =>
                setValue('phone', value, {
                  shouldDirty: true,
                })
              }
              error={errors.phone?.message}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-muted-foreground text-sm">Endereço</h3>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="postalCode">CEP</Label>
            <div className="relative">
              <FormInput
                id="postalCode"
                placeholder="12345-678"
                maxLength={9}
                {...register('postalCode')}
                onChange={handleZipCodeChange}
                onBlur={handlePostalCodeBlur}
                error={errors.postalCode?.message}
                disabled={isSearchingCep}
              />

              {isSearchingCep && (
                <Loader2 className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin" />
              )}
            </div>
            <p className="text-muted-foreground text-xs">
              Apenas números, sem hífen
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Rua/Avenida</Label>
            <FormInput
              id="address"
              placeholder="Rua das Flores"
              {...register('address')}
              error={errors.address?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressNumber">Número</Label>
            <FormInput
              id="addressNumber"
              placeholder="123"
              {...register('addressNumber')}
              error={errors.addressNumber?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="complement">Complemento (opcional)</Label>
            <FormInput
              id="complement"
              placeholder="Loja 2"
              {...register('complement')}
              error={errors.complement?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="province">Bairro</Label>
            <FormInput
              id="province"
              placeholder="Centro"
              {...register('province')}
              error={errors.province?.message}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isCreating}
        >
          Cancelar
        </Button>

        <Button type="submit" disabled={isCreating}>
          {isCreating ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Criando conta...
            </>
          ) : (
            'Criar conta Asaas'
          )}
        </Button>
      </div>
    </form>
  )
}
