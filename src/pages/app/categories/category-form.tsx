import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { createCategory } from '@/api/manager/categories/create-category'
import type { Category } from '@/api/manager/categories/get-categories'
import { updateCategory } from '@/api/manager/categories/update-category'
import { appalert } from '@/components/app-alert/app-alert-context'
import { FormInput } from '@/components/form/form-input'
import { FormTextarea } from '@/components/form/form-text-area'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { queryClient } from '@/lib/react-query'

const categoryFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(50),
  description: z.string().max(300).nullable().optional(),
})

export type CategoryFormSchema = z.infer<typeof categoryFormSchema>

interface CategoryFormProps {
  initialData?: Category
  isLoading?: boolean
}

export function CategoryForm({
  initialData,
  isLoading = false,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CategoryFormSchema>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
    },
  })

  const { mutateAsync: createCategoryFn } = useMutation({
    mutationFn: createCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['categories'],
      })

      appalert.success('Excelente', 'Categoria criada com sucesso.')
    },
  })

  const { mutateAsync: updateCategoryFn } = useMutation({
    mutationFn: updateCategory,
    onSuccess: async (_, data) => {
      await queryClient.invalidateQueries({
        queryKey: ['categories'],
      })

      reset(data)

      appalert.success('Excelente', 'Categoria atualizada com sucesso.')
    },
  })

  const onSubmit = async (data: CategoryFormSchema) => {
    const categoryId = initialData?.id

    if (categoryId) {
      await updateCategoryFn({
        categoryId,
        ...data,
      })
    } else {
      await createCategoryFn(data)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Nome</Label>
        <FormInput
          id="name"
          placeholder="Lanches, Bebidas, Sobremesas..."
          disabled={isLoading || isSubmitting}
          {...register('name')}
          error={errors.name?.message}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <FormTextarea
          id="description"
          placeholder="Descreva a categoria..."
          className="h-20"
          disabled={isLoading || isSubmitting}
          {...register('description')}
          error={errors.description?.message}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading || isSubmitting || !isDirty}>
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            'Salvar categoria'
          )}
        </Button>
      </div>
    </form>
  )
}
