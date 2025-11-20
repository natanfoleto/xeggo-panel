import { CheckCircle2 } from 'lucide-react'

import { formatCpfCnpj } from '@/utils/format-cpf-cnpj'

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '../../../../../components/ui/alert'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../../components/ui/card'

interface AsaasAccountProps {
  account: {
    asaasAccountId?: string
    asaasWalletId?: string
    asaasCpfCnpj?: string
    asaasEmail?: string
    asaasLoginEmail?: string
  }
}

export function AsaasAccount({
  account: {
    asaasAccountId,
    asaasWalletId,
    asaasCpfCnpj,
    asaasEmail,
    asaasLoginEmail,
  },
}: AsaasAccountProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Pagamentos online configurados
        </CardTitle>

        <CardDescription>
          Sua conta Asaas está ativa e pronta para receber pagamentos
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Alert variant="success">
          <CheckCircle2 className="size-4" />
          <AlertTitle>Tudo certo!</AlertTitle>
          <AlertDescription>
            Você já pode receber pagamentos via PIX e Cartão de Crédito. Os
            valores serão creditados automaticamente em sua conta Asaas, sem
            nenhuma taxa da plataforma.
          </AlertDescription>
        </Alert>

        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">
            Account ID:{' '}
            <span className="text-foreground font-mono text-sm">
              {asaasAccountId}
            </span>
          </p>

          <p className="text-muted-foreground text-sm">
            Wallet ID:{' '}
            <span className="text-foreground font-mono text-sm">
              {asaasWalletId}
            </span>
          </p>

          <p className="text-muted-foreground text-sm">
            CPF/CNPJ:{' '}
            <span className="text-foreground font-mono text-sm">
              {asaasCpfCnpj ? formatCpfCnpj(asaasCpfCnpj) : ''}
            </span>
          </p>

          <p className="text-muted-foreground text-sm">
            E-mail:{' '}
            <span className="text-foreground font-mono text-sm">
              {asaasEmail}
            </span>
          </p>

          <p className="text-muted-foreground text-sm">
            E-mail de login:{' '}
            <span className="text-foreground font-mono text-sm">
              {asaasLoginEmail}
            </span>
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <h4 className="font-medium">Como funciona:</h4>
          <ul className="text-muted-foreground list-inside list-disc space-y-1">
            <li>Clientes pagam via PIX, Cartão de Crédito ou Débito</li>
            <li>Você recebe 100% do valor automaticamente</li>
            <li>A plataforma Xeggo fica com 0% de comissão</li>
            <li>
              Saque disponível para sua conta bancária (Tarifas Asaas no saque)
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
