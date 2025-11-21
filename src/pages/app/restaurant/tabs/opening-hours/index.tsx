import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  getOpeningHours,
  type WeekDay,
} from '@/api/manager/restaurants/opening-hours/get-opening-hours'
import { updateOpeningHours } from '@/api/manager/restaurants/opening-hours/update-opening-hours'
import { appalert } from '@/components/app-alert/app-alert-context'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { queryClient } from '@/lib/react-query'

import { OpeningHoursDialog } from './opening-hours-dialog'
import { OpeningHoursSkeleton } from './opening-hours-skeleton'

export const weekDayLabels: Record<WeekDay, string> = {
  sunday: 'Domingo',
  monday: 'Segunda',
  tuesday: 'Terça',
  wednesday: 'Quarta',
  thursday: 'Quinta',
  friday: 'Sexta',
  saturday: 'Sábado',
}

export const weekDayOptions: WeekDay[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

export const openingHoursSchema = z.object({
  hours: z.array(
    z.object({
      id: z.string().optional(),
      weekDay: z.enum([
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ]),
      openTime: z
        .string()
        .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Formato: HH:MM'),
      closeTime: z
        .string()
        .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Formato: HH:MM'),
    }),
  ),
})

type OpeningHoursSchema = z.infer<typeof openingHoursSchema>

export function OpeningHoursSettings() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<WeekDay>()

  const { data: openingHours, isLoading } = useQuery({
    queryKey: ['opening-hours'],
    queryFn: getOpeningHours,
  })

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<OpeningHoursSchema>({
    resolver: zodResolver(openingHoursSchema),
    values: {
      hours: openingHours || [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'hours',
  })

  const { mutateAsync: updateOpeningHoursFn } = useMutation({
    mutationFn: updateOpeningHours,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['opening-hours'],
      })

      appalert.success('Excelente', 'Horários atualizados com sucesso.')
    },
  })

  const handleOpenDialog = (day?: WeekDay) => {
    setSelectedDay(day)
    setDialogOpen(true)
  }

  const handleAppendHour = (hour: {
    weekDay: WeekDay
    openTime: string
    closeTime: string
  }) => {
    if (hour.openTime >= hour.closeTime) {
      return appalert.error(
        'Ooops',
        'O horário de fechamento deve ser maior que o de abertura.',
      )
    }

    const isDuplicate = fields.some(
      (field) =>
        field.weekDay === hour.weekDay &&
        field.openTime === hour.openTime &&
        field.closeTime === hour.closeTime,
    )

    if (isDuplicate) {
      return appalert.error(
        'Ooops',
        'Este horário já foi adicionado para este dia.',
      )
    }

    append(hour)
  }

  const handleRemoveHour = (id: string) => {
    const index = fields.findIndex((field) => field.id === id)
    if (index !== -1) {
      remove(index)
    }
  }

  const onSubmit = async (formData: OpeningHoursSchema) => {
    const originalHours = openingHours || []
    const currentHours = formData.hours

    const deletedHourIds = originalHours
      .filter(
        (original) =>
          !currentHours.some((current) => current.id === original.id),
      )
      .map((hour) => hour.id)

    const newOrUpdatedHours = currentHours.map((hour) => ({
      id: hour.id,
      weekDay: hour.weekDay,
      openTime: hour.openTime,
      closeTime: hour.closeTime,
    }))

    for (const hour of newOrUpdatedHours) {
      if (hour.openTime >= hour.closeTime)
        return appalert.error(
          'Ooops',
          'O horário de fechamento deve ser maior que o de abertura.',
        )
    }

    await updateOpeningHoursFn({
      openingHours: {
        newOrUpdatedHours,
        deletedHourIds,
      },
    })
  }

  const calculateTotalHours = (day: WeekDay) => {
    const dayHours = fields
      .map((field, index) => ({ ...field, index }))
      .filter((field) => watch(`hours.${field.index}.weekDay`) === day)

    if (dayHours.length === 0) return '0h'

    const totalMinutes = dayHours.reduce((total, { index }) => {
      const openTime = watch(`hours.${index}.openTime`)
      const closeTime = watch(`hours.${index}.closeTime`)

      const [openHour, openMin] = openTime.split(':').map(Number)
      const [closeHour, closeMin] = closeTime.split(':').map(Number)

      const openInMinutes = openHour * 60 + openMin
      const closeInMinutes = closeHour * 60 + closeMin

      return total + (closeInMinutes - openInMinutes)
    }, 0)

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    if (minutes === 0) return `${hours}h`

    return `${hours}h ${minutes}min`
  }

  const renderDaySchedule = (day: WeekDay) => {
    const dayHours = fields
      .map((field, index) => ({ ...field, index }))
      .filter((field) => watch(`hours.${field.index}.weekDay`) === day)
      .sort((a, b) => {
        const aTime = watch(`hours.${a.index}.openTime`)
        const bTime = watch(`hours.${b.index}.openTime`)

        return aTime.localeCompare(bTime)
      })

    if (dayHours.length === 0) {
      return (
        <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
          Fechado
        </div>
      )
    }

    return (
      <div className="space-y-1">
        {dayHours.map(({ index, id }) => {
          const openTime = watch(`hours.${index}.openTime`)
          const closeTime = watch(`hours.${index}.closeTime`)
          const isNew = !id

          return (
            <div
              key={id}
              className={`rounded bg-violet-100 px-2 py-1.5 text-center text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 ${
                isNew ? 'ring-2 ring-violet-500' : ''
              }`}
            >
              {openTime} - {closeTime}
            </div>
          )
        })}
      </div>
    )
  }

  function handleCancel() {
    reset({
      hours: openingHours,
    })
  }

  if (isLoading) return <OpeningHoursSkeleton />

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Horários de funcionamento
          </CardTitle>
          <CardDescription>
            Clique em um dia para adicionar horários de funcionamento
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-wrap justify-center gap-4">
              {weekDayOptions.map((day) => (
                <div
                  key={day}
                  className="flex max-w-80 min-w-64 flex-1 flex-col gap-2"
                >
                  <div className="text-center">
                    <div className="font-semibold">{weekDayLabels[day]}</div>
                    <span className="text-muted-foreground text-xs">
                      Aberto por {calculateTotalHours(day)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenDialog(day)}
                    className="hover:bg-muted min-h-[120px] flex-1 cursor-pointer rounded-lg border p-2 transition-colors"
                  >
                    {renderDaySchedule(day)}
                  </button>
                </div>
              ))}
            </div>

            {isDirty && (
              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" type="button" onClick={handleCancel}>
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  disabled={isLoading || isSubmitting || !isDirty}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    'Salvar'
                  )}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      <OpeningHoursDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedDay={selectedDay}
        existingHours={fields}
        onAppend={handleAppendHour}
        onRemove={handleRemoveHour}
      />
    </>
  )
}
