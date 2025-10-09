import { Plus, Trash2 } from 'lucide-react'
import {
  type Control,
  type FieldErrors,
  useFieldArray,
  type UseFormRegister,
  type UseFormSetValue,
  type UseFormWatch,
} from 'react-hook-form'

import { FormInput } from '@/components/form/form-input'
import { FormPriceInput } from '@/components/form/form-price-input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

import type { ProductFormSchema } from './product-form'

interface ComplementGroupFieldProps {
  groupIndex: number
  openValue?: string
  onOpenChange?: (value: string | undefined) => void
  control: Control<ProductFormSchema>
  register: UseFormRegister<ProductFormSchema>
  watch: UseFormWatch<ProductFormSchema>
  setValue: UseFormSetValue<ProductFormSchema>
  remove: () => void
  errors: FieldErrors<ProductFormSchema>
}

export function ComplementGroupField({
  groupIndex,
  openValue,
  onOpenChange,
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

  const groupName = watch(`complementGroups.${groupIndex}.name`)

  return (
    <Accordion
      value={openValue}
      onValueChange={onOpenChange}
      type="single"
      collapsible
      className="w-full rounded-md border"
    >
      <AccordionItem value={`group-${groupIndex}`}>
        <div className="bg-muted flex items-center justify-between pr-2 pl-4">
          <AccordionTrigger className="cursor-pointer gap-2 hover:no-underline">
            <h2>{groupName || 'Grupo sem nome'}</h2>
          </AccordionTrigger>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              remove()
            }}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        <AccordionContent className="p-4">
          <div className="space-y-4">
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
                  {...register(`complementGroups.${groupIndex}.min`, {
                    valueAsNumber: true,
                  })}
                  error={errors.complementGroups?.[groupIndex]?.min?.message}
                />
              </div>

              <div className="space-y-2">
                <Label>Máximo</Label>
                <FormInput
                  type="number"
                  min="1"
                  {...register(`complementGroups.${groupIndex}.max`, {
                    valueAsNumber: true,
                  })}
                  error={errors.complementGroups?.[groupIndex]?.max?.message}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  appendComplement({
                    name: '',
                    priceInCents: null,
                    description: null,
                  })
                }
              >
                <Plus className="size-4" />
                Novo complemento
              </Button>

              {complementFields.map((complementField, complementIndex) => (
                <div
                  key={complementField.id}
                  className="flex items-center gap-3 rounded-md border p-3"
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
                            errors.complementGroups?.[groupIndex]
                              ?.complements?.[complementIndex]?.name?.message
                          }
                        />
                      </div>

                      <div className="w-48">
                        <FormPriceInput
                          value={
                            watch(
                              `complementGroups.${groupIndex}.complements.${complementIndex}.priceInCents`,
                            ) || 0
                          }
                          onChange={(value) =>
                            setValue(
                              `complementGroups.${groupIndex}.complements.${complementIndex}.priceInCents`,
                              value,
                              { shouldDirty: true },
                            )
                          }
                          error={
                            errors.complementGroups?.[groupIndex]
                              ?.complements?.[complementIndex]?.priceInCents
                              ?.message
                          }
                        />
                      </div>
                    </div>

                    <FormInput
                      placeholder="Descrição (opcional)"
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
