import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ImageIcon, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import {
  type Control,
  type FieldErrors,
  useFieldArray,
  useForm,
  type UseFormRegister,
  type UseFormSetValue,
  type UseFormWatch,
} from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { getCategories } from '@/api/categories/get-categories'
import { createProduct } from '@/api/products/create-product'
import { uploadProductImage } from '@/api/products/upload-product-image'
import { FormInput } from '@/components/form/form-input'
import { FormSelect } from '@/components/form/form-select'
import { FormTextarea } from '@/components/form/form-text-area'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { SelectItem } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
  initialData?: Partial<ProductFormSchema>
  isLoading?: boolean
}

export function ProductForm({
  initialData,
  isLoading = false,
}: ProductFormProps) {
  const [photo, setPhoto] = useState<File | string | null>(
    initialData?.photoUrl || null,
  )

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
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
    onSuccess: () => {
      toast.success('Produto criado com sucesso!')
    },
  })

  const { mutateAsync: uploadPhotoFn } = useMutation({
    mutationFn: uploadProductImage,
  })

  const onSubmit = async (data: ProductFormSchema) => {
    const { productId } = await createProductFn(data)

    if (photo instanceof File) {
      await uploadPhotoFn({
        productId,
        file: photo,
      })
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full flex-col justify-between space-y-4"
    >
      <Tabs defaultValue="data" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="data">Dados</TabsTrigger>
          <TabsTrigger value="ingredients">Ingredientes</TabsTrigger>
          <TabsTrigger value="complements">Complementos</TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="grid grid-cols-12 gap-4 py-4">
          <div className="col-span-8 space-y-1.5">
            <Label htmlFor="name">Nome</Label>
            <FormInput
              id="name"
              disabled={isLoading || isSubmitting}
              {...register('name')}
              error={errors.name?.message}
            />
          </div>

          <div className="col-span-4 space-y-1.5">
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
              className="h-20"
              disabled={isLoading || isSubmitting}
              {...register('description')}
              error={errors.description?.message}
            />
          </div>

          <div className="col-span-12 space-y-2">
            <Label htmlFor="priceInCents">Preço</Label>
            <FormInput
              id="priceInCents"
              type="number"
              disabled={isLoading || isSubmitting}
              {...register('priceInCents', { valueAsNumber: true })}
              error={errors.priceInCents?.message}
            />
          </div>

          <div className="col-span-12 space-y-2">
            <div className="flex items-center justify-between">
              <Label>Foto do produto</Label>

              {photo && (
                <div
                  onClick={handleFileRemove}
                  className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-0.5 text-xs transition-colors"
                >
                  <X className="size-4" />
                  <span>
                    {photo instanceof File
                      ? photo.name
                      : 'Remover foto do prêmio'}
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
                  className="h-72 w-full cursor-pointer rounded-sm border object-contain"
                  onClick={() => document.getElementById('file')?.click()}
                />
              ) : (
                <div
                  onClick={() => document.getElementById('file')?.click()}
                  className="flex h-72 w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-sm border"
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
                onChange={(e) => handleFileChange(e)}
              />
            </div>
          </div>

          {initialData && (
            <div className="col-span-12 flex items-center space-x-2">
              <Switch
                id="active"
                disabled={isLoading || isSubmitting}
                checked={watch('active')}
                onCheckedChange={(checked) => setValue('active', checked)}
              />
              <Label htmlFor="active">Produto ativo</Label>
            </div>
          )}
        </TabsContent>

        <TabsContent value="ingredients" className="space-y-6 py-4">
          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendIngredient({ name: '' })}
            >
              <Plus className="size-4" />
              Adicionar ingrediente
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
              variant="outline"
              size="sm"
              onClick={() =>
                appendComplementGroup({
                  name: '',
                  mandatory: false,
                  min: 0,
                  max: 1,
                  complements: [],
                })
              }
            >
              <Plus className="size-4" />
              Adicionar grupo
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
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button
          type="submit"
          disabled={isLoading || isSubmitting}
          variant="default"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar produto'}
        </Button>
      </div>
    </form>
  )
}

interface ComplementGroupFieldProps {
  groupIndex: number
  control: Control<ProductFormSchema>
  register: UseFormRegister<ProductFormSchema>
  watch: UseFormWatch<ProductFormSchema>
  setValue: UseFormSetValue<ProductFormSchema>
  remove: () => void
  errors: FieldErrors<ProductFormSchema>
}

function ComplementGroupField({
  groupIndex,
  control,
  register,
  watch,
  setValue,
  remove,
  errors,
}: ComplementGroupFieldProps) {
  const {
    fields: complementFields,
    append: appendComplement,
    remove: removeComplement,
  } = useFieldArray({
    control,
    name: `complementGroups.${groupIndex}.complements`,
  })

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <Label>Nome do grupo</Label>
            <FormInput
              placeholder="Ex: Molhos, Adicionais..."
              {...register(`complementGroups.${groupIndex}.name`)}
              error={errors.complementGroups?.[groupIndex]?.name?.message}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={watch(`complementGroups.${groupIndex}.mandatory`)}
              onCheckedChange={(checked) =>
                setValue(`complementGroups.${groupIndex}.mandatory`, checked)
              }
            />
            <Label>Obrigatório</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mínimo</Label>
              <FormInput
                type="number"
                min="0"
                {...register(`complementGroups.${groupIndex}.min`)}
              />
            </div>

            <div className="space-y-2">
              <Label>Máximo</Label>
              <FormInput
                type="number"
                min="1"
                {...register(`complementGroups.${groupIndex}.max`)}
              />
            </div>
          </div>
        </div>

        <Button type="button" variant="outline" size="icon" onClick={remove}>
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            appendComplement({
              name: '',
              priceInCents: 0,
              description: null,
            })
          }
        >
          <Plus className="size-4" />
          Adicionar complemento
        </Button>

        {complementFields.map((complementField, complementIndex) => (
          <div
            key={complementField.id}
            className="flex items-center gap-3 rounded border p-3"
          >
            <div className="w-full space-y-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <FormInput
                    placeholder="Nome do complemento"
                    {...register(
                      `complementGroups.${groupIndex}.complements.${complementIndex}.name`,
                    )}
                    error={
                      errors.complementGroups?.[groupIndex]?.complements?.[
                        complementIndex
                      ]?.name?.message
                    }
                  />
                </div>

                <div className="w-64">
                  <FormInput
                    type="number"
                    placeholder="Preço"
                    {...(register(
                      `complementGroups.${groupIndex}.complements.${complementIndex}.priceInCents`,
                    ),
                    { valueAsNumber: true })}
                    error={
                      errors.complementGroups?.[groupIndex]?.complements?.[
                        complementIndex
                      ]?.priceInCents?.message
                    }
                  />
                </div>
              </div>

              <FormTextarea
                placeholder="Descrição (opcional)"
                className="min-h-[60px]"
                {...register(
                  `complementGroups.${groupIndex}.complements.${complementIndex}.description`,
                )}
                error={
                  errors.complementGroups?.[groupIndex]?.complements?.[
                    complementIndex
                  ]?.description?.message
                }
              />
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeComplement(complementIndex)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
