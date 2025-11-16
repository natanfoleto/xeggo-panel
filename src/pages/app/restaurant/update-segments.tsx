import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  getSegments,
  type Segment,
} from '@/api/manager/restaurants/get-segments'
import { updateSegments } from '@/api/manager/restaurants/update-segments'
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

import { SegmentsSkeleton } from './segments-skeleton'

const segmentLabels: Record<Segment, string> = {
  restaurant: 'Restaurante',
  bakery: 'Padaria',
  snackBar: 'Lanchonete',
  pizzeria: 'Pizzaria',
  iceCreamShop: 'Sorveteria',
  coffee: 'Cafeteria',
  fastFood: 'Fast Food',
  barbecue: 'Churrascaria',
  japanese: 'Japonesa',
  brazilian: 'Brasileira',
  italian: 'Italiana',
  chinese: 'Chinesa',
  mexican: 'Mexicana',
  arabic: 'Árabe',
  bar: 'Bar',
}

const segmentsSchema = z.object({
  selectedSegments: z.array(
    z.enum([
      'restaurant',
      'bakery',
      'snackBar',
      'pizzeria',
      'iceCreamShop',
      'coffee',
      'fastFood',
      'barbecue',
      'japanese',
      'brazilian',
      'italian',
      'chinese',
      'mexican',
      'arabic',
      'bar',
    ]),
  ),
})

type SegmentsSchema = z.infer<typeof segmentsSchema>

export function UpdateSegments() {
  const { data: segments, isLoading } = useQuery({
    queryKey: ['segments'],
    queryFn: getSegments,
  })

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<SegmentsSchema>({
    resolver: zodResolver(segmentsSchema),
    defaultValues: {
      selectedSegments: [],
    },
  })

  useEffect(() => {
    if (segments) setValue('selectedSegments', segments)
  }, [segments, setValue])

  const { mutateAsync: updateSegmentsFn } = useMutation({
    mutationFn: updateSegments,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['segments'],
      })

      appalert.success('Excelente', 'Segmentos atualizados com sucesso.')
    },
  })

  const onSubmit = async ({ selectedSegments }: SegmentsSchema) => {
    await updateSegmentsFn({
      segments: {
        selectedSegments,
      },
    })

    reset({ selectedSegments })
  }

  const selectedSegments = watch('selectedSegments')

  const toggleSegment = (segment: Segment) => {
    const isSelected = selectedSegments.includes(segment)

    if (isSelected) {
      setValue(
        'selectedSegments',
        selectedSegments.filter((s) => s !== segment),
        { shouldDirty: true },
      )
    } else {
      setValue('selectedSegments', [...selectedSegments, segment], {
        shouldDirty: true,
      })
    }
  }

  function handleCancel() {
    reset({
      selectedSegments: segments,
    })
  }

  if (isLoading) return <SegmentsSkeleton />

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Segmentos</CardTitle>

        <CardDescription>
          Selecione os tipos de estabelecimento que melhor descrevem seu
          restaurante
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {Object.entries(segmentLabels).map(([value, label]) => {
              const isSelected = selectedSegments.includes(value as Segment)

              return (
                <Button
                  key={value}
                  type="button"
                  variant="secondary"
                  onClick={() => toggleSegment(value as Segment)}
                  className={`h-auto px-4 py-2 whitespace-nowrap ${
                    isSelected
                      ? 'bg-violet-100 text-violet-700 hover:bg-violet-100 dark:bg-violet-900/30 dark:text-violet-400'
                      : ''
                  }`}
                >
                  {label}
                </Button>
              )
            })}
          </div>

          {isDirty && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={handleCancel}>
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={isLoading || isSubmitting || !isDirty}
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Salvar'}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
