import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
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
import { z } from 'zod'

import { getCategories } from '@/api/categories/get-categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

const productFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  description: z.string().max(500).optional(),
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
          priceInCents: z.number().int().min(0).optional(),
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

  // async function handleUploadPhoto(productId: string) {
  //   if (photo === null) {
  //     // await updateAwardPhotoAction({
  //     //   params: { schoolSlug: schoolSlug!, awardId },
  //     //   body: new FormData(),
  //     // })
  //   }

  //   if (photo instanceof File) {
  //     const formData = new FormData()
  //     formData.append('file', photo)

  //     // await updateAwardPhotoAction({
  //     //   params: { schoolSlug: schoolSlug!, awardId },
  //     //   body: formData,
  //     // })
  //   }
  // }

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
      onSubmit={handleSubmit(() => {})}
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
            <Input
              id="name"
              disabled={isLoading || isSubmitting}
              {...register('name')}
            />
          </div>

          <div className="col-span-4 space-y-1.5">
            <Label htmlFor="categoryId">Categoria</Label>

            <Select
              disabled={isLoading || isSubmitting}
              onValueChange={(value) => setValue('categoryId', value)}
              defaultValue={initialData?.categoryId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>

              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-12 space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              className="h-20"
              disabled={isLoading || isSubmitting}
              {...register('description')}
            />
          </div>

          <div className="col-span-12 space-y-2">
            <Label htmlFor="priceInCents">Preço</Label>
            <Input
              id="priceInCents"
              type="number"
              disabled={isLoading || isSubmitting}
              {...register('priceInCents')}
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
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Ingredientes</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendIngredient({ name: '' })}
              >
                <Plus className="h-4 w-4" />
                Adicionar ingrediente
              </Button>
            </div>

            {ingredientFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Nome do ingrediente"
                    {...register(`ingredients.${index}.name`)}
                  />
                  {errors.ingredients?.[index]?.name && (
                    <p className="text-sm text-red-500">
                      {errors.ingredients[index]?.name?.message}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeIngredient(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="complements" className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Grupos de complementos</h3>
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
                <Plus className="h-4 w-4" />
                Adicionar grupo
              </Button>
            </div>

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
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <Label>Nome do grupo</Label>
            <Input
              placeholder="Ex: Molhos, Adicionais..."
              {...register(`complementGroups.${groupIndex}.name`)}
            />
            {errors.complementGroups?.[groupIndex]?.name && (
              <p className="text-sm text-red-500">
                {errors.complementGroups[groupIndex]?.name?.message}
              </p>
            )}
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
              <Input
                type="number"
                min="0"
                {...register(`complementGroups.${groupIndex}.min`)}
              />
            </div>
            <div className="space-y-2">
              <Label>Máximo</Label>
              <Input
                type="number"
                min="1"
                {...register(`complementGroups.${groupIndex}.max`)}
              />
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={remove}
          className="ml-2"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Complementos</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendComplement({
                name: '',
                priceInCents: undefined,
                description: null,
              })
            }
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </div>

        {complementFields.map((complementField, complementIndex) => (
          <div
            key={complementField.id}
            className="space-y-2 rounded border p-3"
          >
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Nome do complemento"
                  {...register(
                    `complementGroups.${groupIndex}.complements.${complementIndex}.name`,
                  )}
                />
              </div>
              <div className="w-32">
                <Input
                  type="number"
                  placeholder="Preço"
                  {...register(
                    `complementGroups.${groupIndex}.complements.${complementIndex}.priceInCents`,
                  )}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeComplement(complementIndex)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              placeholder="Descrição (opcional)"
              className="min-h-[60px]"
              {...register(
                `complementGroups.${groupIndex}.complements.${complementIndex}.description`,
              )}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
