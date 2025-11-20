import { AlertCircle } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface AsaasAlertProps {
  onLinkAccount: () => void
  onCreateAccount: () => void
}

export function AsaasAlert({
  onLinkAccount,
  onCreateAccount,
}: AsaasAlertProps) {
  return (
    <>
      <Alert variant="warning" className="mb-6">
        <AlertCircle className="size-4" />
        <AlertTitle>Atenção</AlertTitle>

        <AlertDescription>
          <div className="space-y-1">
            <p>
              A plataforma Asaas cobra suas próprias tarifas nas transações
              realizadas pelos seus clientes, variando conforme o meio de
              pagamento (Pix, cartão, boleto). Esses valores são descontados
              automaticamente no recebimento. Você também pode ter tarifas
              adicionais ao sacar o saldo para sua conta bancária. As taxas
              podem ser consultadas diretamente no site do Asaas, na página “
              <a
                href="https://www.asaas.com/precos-e-taxas"
                target="_blank"
                className="underline"
                rel="noreferrer"
              >
                Preços e taxas
              </a>
              “.
            </p>

            <p>
              Para utilizar os pagamentos online pela nossa plataforma, você
              precisa ter uma conta no Asaas. Caso ainda não possua, será
              necessário criar sua conta e validá-la. Se você já tiver uma conta
              existente, basta vinculá-la ao painel para habilitar os
              recebimentos e saques.
            </p>
          </div>

          <p className="text-foreground mt-4 text-xs">
            Escolha uma opção a baixo:
          </p>

          <button
            onClick={onLinkAccount}
            className="group hover:text-primary/90 text-primary mt-2 inline-flex cursor-pointer items-center gap-2 text-sm"
          >
            •
            <span className="underline-offset-4 group-hover:underline">
              Vincular conta Asaas existente
            </span>
          </button>

          <p className="text-muted-foreground ml-6 text-xs">
            Use esta opção se você já possui uma conta no Asaas. Basta conectar
            sua conta para liberar os pagamentos e saques.
          </p>

          <button
            onClick={onCreateAccount}
            className="group hover:text-primary/90 text-primary inline-flex cursor-pointer items-center gap-2 text-sm"
          >
            •
            <span className="underline-offset-4 group-hover:underline">
              Criar conta Asaas pelo painel Xeggo
            </span>
          </button>

          <p className="text-muted-foreground ml-6 text-xs">
            Essa opção cria automaticamente sua conta dentro do próprio painel,
            de forma rápida e integrada ao Xeggo. Após a criação, o Asaas pode
            solicitar que você ative sua conta pelo e-mail cadastrado ou que
            redefina a senha para finalizar a configuração.
          </p>

          <Dialog>
            <DialogTrigger asChild>
              <button className="group hover:text-primary/90 text-primary inline-flex cursor-pointer items-center gap-2 text-sm">
                •
                <span className="underline-offset-4 group-hover:underline">
                  Como criar sua conta diretamente pela plataforma Asaas
                </span>
              </button>
            </DialogTrigger>

            <p className="text-muted-foreground ml-6 text-xs">
              Caso prefira, você pode criar sua conta diretamente no site
              oficial do Asaas. Veja o passo a passo completo no tutorial.
            </p>

            <DialogContent className="w-full max-w-7xl sm:max-w-7xl">
              <DialogHeader>
                <DialogTitle>Tutorial — Criando sua conta Asaas</DialogTitle>
              </DialogHeader>

              <div className="w-full space-y-6">
                <div
                  className="relative w-full"
                  style={{ paddingTop: '56.25%' }}
                >
                  <iframe
                    className="absolute top-0 left-0 h-full w-full rounded-lg"
                    src="https://www.youtube.com/embed/zw0R_sgBDnA?si=AAB071Gr_CjTqfY8"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>

                <div className="flex justify-center">
                  <a
                    href="https://www.asaas.com/cadastro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/90 group text-sm"
                  >
                    👉{' '}
                    <span className="underline-offset-4 group-hover:underline">
                      Abrir site do Asaas para criar sua conta
                    </span>
                  </a>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </AlertDescription>
      </Alert>
    </>
  )
}
