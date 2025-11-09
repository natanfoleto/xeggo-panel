import { Search, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const couponsFiltersSchema = z.object({
  search: z.string().optional(),
  active: z.string().optional(),
})

type CouponFiltersSchema = z.infer<typeof couponsFiltersSchema>

export function CouponTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search')
  const active = searchParams.get('active')

  const { register, handleSubmit, reset, setValue } =
    useForm<CouponFiltersSchema>({
      defaultValues: {
        search: search ?? '',
        active: active ?? 'all',
      },
    })

  function handleFilter(data: CouponFiltersSchema) {
    const search = data.search?.toString()
    const active = data.active?.toString()

    setSearchParams((prev) => {
      if (search) {
        prev.set('search', search)
      } else {
        prev.delete('search')
      }

      if (active && active !== 'all') {
        prev.set('active', active)
      } else {
        prev.delete('active')
      }

      prev.set('page', '1')

      return prev
    })
  }

  function handleClearFilters() {
    setSearchParams((prev) => {
      prev.delete('search')
      prev.delete('active')
      prev.set('page', '1')

      return prev
    })

    reset({
      search: '',
      active: 'all',
    })
  }

  const hasAnyFilter = !!search || !!active

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="flex flex-wrap items-center gap-2"
    >
      <Input
        placeholder="Código do cupom"
        className="h-8 w-[200px]"
        {...register('search')}
      />

      <Select
        defaultValue={active ?? 'all'}
        onValueChange={(value) => setValue('active', value)}
      >
        <SelectTrigger className="h-8 w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos status</SelectItem>
          <SelectItem value="true">Ativos</SelectItem>
          <SelectItem value="false">Inativos</SelectItem>
        </SelectContent>
      </Select>

      <Button type="submit" variant="secondary" size="xs">
        <Search className="h-4 w-4" />
        Filtrar resultados
      </Button>

      <Button
        type="button"
        variant="outline"
        size="xs"
        disabled={!hasAnyFilter}
        onClick={handleClearFilters}
      >
        <X className="h-4 w-4" />
        Remover filtros
      </Button>
    </form>
  )
}
