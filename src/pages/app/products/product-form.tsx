import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ImageIcon, Loader2, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { type FieldErrors, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

import { getCategories } from '@/api/categories/get-categories'
import { createProduct } from '@/api/products/create-product'
import { deleteProductImage } from '@/api/products/delete-product-image'
import { updateProduct } from '@/api/products/update-product'
import { uploadProductImage } from '@/api/products/upload-product-image'
import { appalert } from '@/components/app-alert/app-alert-context'
import { FormInput } from '@/components/form/form-input'
import { FormPriceInput } from '@/components/form/form-price-input'
import { FormSelect } from '@/components/form/form-select'
import { FormTextarea } from '@/components/form/form-text-area'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { SelectItem } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { queryClient } from '@/lib/react-query'

import { ComplementGroupField } from './complement-group-field'

const productFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  description: z.string().max(500).nullable().optional(),
  priceInCents: z.number().int().positive('Preço deve ser positivo'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  photoUrl: z.string().optional().nullable(),
  active: z.boolean(),
  ingredients: z.array(
    z.object({
      name: z.string().min(1, 'Nome do ingrediente é obrigatório').max(100),
    }),
  ),
  complementGroups: z.array(
    z.object({
      name: z.string().min(1, 'Nome do grupo é obrigatório').max(100),
      mandatory: z.boolean(),
      min: z.number().int().min(0),
      max: z.number().int().min(1),
      complements: z.array(
        z.object({
          name: z.string().min(1, 'Nome do complemento é obrigatório').max(100),
          priceInCents: z
            .number()
            .int()
            .positive('Preço deve ser positivo')
            .nullable(),
          description: z.string().max(300).optional().nullable(),
        }),
      ),
    }),
  ),
})

export type ProductFormSchema = z.infer<typeof productFormSchema>

interface ProductFormProps {
  initialData?: Partial<ProductFormSchema> & { id?: string }
  isLoading?: boolean
}

export function ProductForm({
  initialData,
  isLoading = false,
}: ProductFormProps) {
  const [activeTab, setActiveTab] = useState('data')
  const [openAccordion, setOpenAccordion] = useState<string | undefined>()

  const [photo, setPhoto] = useState<File | string | null>(
    initialData?.photoUrl || null,
  )

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProductFormSchema>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      priceInCents: initialData?.priceInCents ?? 0,
      categoryId: initialData?.categoryId ?? '',
      photoUrl: initialData?.photoUrl ?? null,
      active: initialData?.active ?? true,
      ingredients: initialData?.ingredients ?? [],
      complementGroups: initialData?.complementGroups ?? [],
    },
  })

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: 'ingredients',
  })

  const {
    fields: complementGroupFields,
    append: appendComplementGroup,
    remove: removeComplementGroup,
  } = useFieldArray({
    control,
    name: 'complementGroups',
  })

  const { data: responseCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  })

  const categories = responseCategories?.categories || []

  const { mutateAsync: createProductFn } = useMutation({
    mutationFn: createProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['products'],
      })

      appalert.success('Excelente', 'Produto criado com sucesso.')
    },
  })

  const { mutateAsync: updateProductFn } = useMutation({
    mutationFn: updateProduct,
    onSuccess: async (_, data) => {
      await queryClient.invalidateQueries({
        queryKey: ['products'],
      })

      reset(data)

      appalert.success('Excelente', 'Produto atualizado com sucesso.')
    },
  })

  const { mutateAsync: uploadProductImageFn } = useMutation({
    mutationFn: uploadProductImage,
  })

  const { mutateAsync: deleteProductImageFn } = useMutation({
    mutationFn: deleteProductImage,
  })

  const handleFormError = (errors: FieldErrors<ProductFormSchema>) => {
    if (
      errors.name ||
      errors.description ||
      errors.priceInCents ||
      errors.categoryId ||
      errors.photoUrl
    ) {
      return setActiveTab('data')
    }

    if (errors.ingredients) {
      return setActiveTab('ingredients')
    }

    if (errors.complementGroups) {
      return setActiveTab('complements')
    }
  }

  const onSubmit = async (data: ProductFormSchema) => {
    const productId = initialData?.id

    if (productId) {
      await updateProductFn({
        productId,
        ...data,
      })

      if (photo instanceof File) {
        await uploadProductImageFn({
          productId: initialData.id!,
          file: photo,
        })
      } else if (photo === null && initialData.photoUrl) {
        await deleteProductImageFn({
          productId: initialData.id!,
        })
      }
    } else {
      const { productId } = await createProductFn(data)

      if (photo instanceof File) {
        await uploadProductImageFn({
          productId,
          file: photo,
        })
      }
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    setPhoto(file)
    setValue('photoUrl', '', { shouldDirty: true })

    setTimeout(() => {
      event.target.value = ''
    }, 0)
  }

  const handleFileRemove = () => {
    setPhoto(null)
    setValue('photoUrl', null, { shouldDirty: true })
  }

  const handleAppendComplementGroup = () => {
    const newIndex = complementGroupFields.length

    appendComplementGroup({
      name: '',
      mandatory: false,
      min: 0,
      max: 1,
      complements: [],
    })

    setOpenAccordion(`group-${newIndex}`)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, handleFormError)}
      className="flex h-full flex-col justify-between space-y-4"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="data">Dados</TabsTrigger>
          <TabsTrigger value="ingredients">Ingredientes</TabsTrigger>
          <TabsTrigger value="complements">Complementos</TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="grid grid-cols-12 gap-4 py-4">
          <div className="col-span-12 space-y-1.5 md:col-span-8">
            <Label htmlFor="name">Nome</Label>
            <FormInput
              id="name"
              placeholder="X-Bacon, Pizza Margherita, Açaí 500ml..."
              disabled={isLoading || isSubmitting}
              {...register('name')}
              error={errors.name?.message}
            />
          </div>

          <div className="col-span-12 space-y-1.5 md:col-span-4">
            <Label htmlFor="categoryId">Categoria</Label>

            <FormSelect
              disabled={isLoading || isSubmitting}
              onValueChange={(value) => setValue('categoryId', value)}
              defaultValue={initialData?.categoryId}
              className="w-full"
              error={errors.categoryId?.message}
            >
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </FormSelect>
          </div>

          <div className="col-span-12 space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <FormTextarea
              id="description"
              placeholder="Prepare-se para uma explosão de sabor"
              className="h-20"
              disabled={isLoading || isSubmitting}
              {...register('description')}
              error={errors.description?.message}
            />
          </div>

          <div className="col-span-12 space-y-2">
            <Label htmlFor="priceInCents">Preço</Label>
            <FormPriceInput
              value={watch('priceInCents')}
              onChange={(value) =>
                setValue('priceInCents', value, { shouldDirty: true })
              }
              disabled={isLoading || isSubmitting}
              error={errors.priceInCents?.message}
            />
          </div>

          <div className="col-span-12 space-y-2">
            <div className="flex items-center justify-between">
              <Label>Foto</Label>

              {photo && (
                <div
                  onClick={handleFileRemove}
                  className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-0.5 text-xs transition-colors"
                >
                  <X className="size-4" />

                  <span>
                    {photo instanceof File ? photo.name : 'Remover foto'}
                  </span>
                </div>
              )}
            </div>

            <div className="relative space-y-2">
              {photo ? (
                <img
                  src={
                    photo instanceof File
                      ? URL.createObjectURL(photo)
                      : photo || undefined
                  }
                  alt="Foto do prêmio"
                  className="bg-primary dark:bg-input/30 border-input h-72 w-full cursor-pointer rounded-sm border object-contain"
                  onClick={() => document.getElementById('file')?.click()}
                />
              ) : (
                <div
                  onClick={() => document.getElementById('file')?.click()}
                  className="bg-primary dark:bg-input/30 border-input flex h-72 w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-sm border"
                >
                  <ImageIcon className="text-muted-foreground size-20 stroke-[0.375]" />

                  <p className="text-muted-foreground text-xs">
                    Clique para selecionar uma imagem
                  </p>
                </div>
              )}

              <input
                hidden
                id="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ingredients" className="space-y-6 py-4">
          <div className="space-y-4">
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => appendIngredient({ name: '' })}
            >
              <Plus className="size-4" />
              Novo ingrediente
            </Button>

            {ingredientFields.length ? (
              <div className="space-y-3 rounded-lg border p-4">
                {ingredientFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <div className="flex-1 space-y-2">
                      <FormInput
                        placeholder="Nome do ingrediente"
                        {...register(`ingredients.${index}.name`)}
                        error={errors.ingredients?.[index]?.name?.message}
                      />
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeIngredient(index)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </TabsContent>

        <TabsContent value="complements" className="space-y-6 py-4">
          <div className="space-y-4">
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={handleAppendComplementGroup}
            >
              <Plus className="size-4" />
              Novo grupo
            </Button>

            {complementGroupFields.map((groupField, groupIndex) => (
              <ComplementGroupField
                key={groupField.id}
                groupIndex={groupIndex}
                control={control}
                register={register}
                watch={watch}
                setValue={setValue}
                remove={() => removeComplementGroup(groupIndex)}
                errors={errors}
                openValue={openAccordion}
                onOpenChange={setOpenAccordion}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button
          type="submit"
          disabled={isLoading || isSubmitting || !isDirty}
          variant="default"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            'Salvar produto'
          )}
        </Button>
      </div>
    </form>
  )
}
