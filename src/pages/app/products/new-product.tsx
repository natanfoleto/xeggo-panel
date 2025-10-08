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

      <DialogContent className="flex h-11/12 min-w-2/3 flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo produto</DialogTitle>
          <DialogDescription>
            Crie um novo produto para vender muito
          </DialogDescription>
        </DialogHeader>

        <ProductForm />
      </DialogContent>
    </Dialog>
  )
}
