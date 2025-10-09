import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { CategoryForm } from './category-form'

export function NewCategory() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Nova categoria</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Categoria</DialogTitle>
          <DialogDescription>
            Adicione uma nova categoria de produtos.
          </DialogDescription>
        </DialogHeader>

        <CategoryForm />
      </DialogContent>
    </Dialog>
  )
}
