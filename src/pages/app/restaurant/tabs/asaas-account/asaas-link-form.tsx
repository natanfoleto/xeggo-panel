import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { linkAsaasAccount } from '@/api/manager/restaurants/link-asaas-account'
import { appalert } from '@/components/app-alert/app-alert-context'
import { FormCpfCnpjInput } from '@/components/form/form-cpf-cnpj-input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { queryClient } from '@/lib/react-query'
import { formatCpfCnpj } from '@/utils/format-cpf-cnpj'
import { isValidCNPJ, isValidCPF } from '@/utils/validate-document'

const linkAccountSchema = z.object({
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
})

export type LinkAccountSchema = z.infer<typeof linkAccountSchema>

export interface AsaasLinkFormProps {
  defaultValues?: LinkAccountSchema
  onCancel: () => void
  onSuccess: () => void
}

export function AsaasLinkForm({
  defaultValues,
  onCancel,
  onSuccess,
}: AsaasLinkFormProps) {
  const {
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LinkAccountSchema>({
    resolver: zodResolver(linkAccountSchema),
    defaultValues: {
      cpfCnpj: '',
    },
  })

  const [openConfirm, setOpenConfirm] = useState(false)
  const [pendingData, setPendingData] = useState<LinkAccountSchema | null>(null)

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
    }
  }, [defaultValues, reset])

  const { mutateAsync: linkAsaasAccountFn, isPending: isLinking } = useMutation(
    {
      mutationFn: linkAsaasAccount,
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['asaas-account'] })

        appalert.success(
          'Conta vinculada!',
          'Sua conta Asaas foi vinculada com sucesso. Agora você pode receber pagamentos online.',
        )

        onSuccess()
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          const data = error.response?.data
          appalert.error(data?.message ?? 'Erro inesperado.')
        } else {
          appalert.error('Erro inesperado.')
        }
      },
    },
  )

  const onSubmit = (data: LinkAccountSchema) => {
    setPendingData(data)
    setOpenConfirm(true)
  }

  async function confirmLink() {
    if (!pendingData) return
    await linkAsaasAccountFn(pendingData)
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-lg border p-6"
      >
        <div className="space-y-4">
          <h3 className="font-semibold">Vincular conta existente</h3>

          <p className="text-muted-foreground text-sm">
            Informe o CPF ou CNPJ usado na criação da conta Asaas
          </p>

          <div className="space-y-2">
            <Label htmlFor="cpfCnpjLink">CPF ou CNPJ</Label>
            <FormCpfCnpjInput
              value={watch('cpfCnpj')}
              onChange={(value) =>
                setValue('cpfCnpj', value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              disabled={isLinking}
              error={errors.cpfCnpj?.message}
            />
            <p className="text-muted-foreground text-xs">
              Digite o documento usado ao criar a conta no site do Asaas
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLinking}
          >
            Cancelar
          </Button>

          <Button type="submit" disabled={isLinking}>
            {isLinking ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Vinculando...
              </>
            ) : (
              'Vincular conta'
            )}
          </Button>
        </div>
      </form>

      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar vinculação da conta</AlertDialogTitle>

            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  Você está prestes a vincular a conta Asaas cadastrada com o
                  documento:
                </p>

                <p className="text-foreground font-semibold">
                  {pendingData ? formatCpfCnpj(pendingData.cpfCnpj) : ''}
                </p>

                <p>Após confirmar:</p>

                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    Este será o novo <b>CPF/CNPJ</b> oficial do restaurante na
                    plataforma Xeggo.
                  </li>
                  <li>
                    Ele substituirá o documento atual cadastrado no restaurante.
                  </li>
                  <li>Não será possível alterar depois.</li>
                </ul>

                <p className="font-medium text-red-400">
                  Verifique com atenção antes de continuar.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLinking}>Cancelar</AlertDialogCancel>

            <AlertDialogAction
              className="bg-red-500 text-white hover:bg-red-600"
              disabled={isLinking}
              onClick={confirmLink}
            >
              {isLinking ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Confirmar e vincular'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
