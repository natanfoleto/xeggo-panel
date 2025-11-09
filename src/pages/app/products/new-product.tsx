import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { ProductForm } from './product-form'

export function NewProduct() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Novo produto</Button>
      </DialogTrigger>

      <DialogContent className="flex h-11/12 min-w-11/12 flex-col overflow-y-auto lg:min-w-2/3">
        <DialogHeader>
          <DialogTitle>Novo produto</DialogTitle>
          <DialogDescription>
            Adicione um novo produto ao seu cardápio. Preencha as informações
            básicas, ingredientes e complementos opcionais.
          </DialogDescription>
        </DialogHeader>

        <ProductForm />
      </DialogContent>
    </Dialog>
  )
}
