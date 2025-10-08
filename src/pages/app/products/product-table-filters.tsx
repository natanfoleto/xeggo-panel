import { Search, X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
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

const productsFiltersSchema = z.object({
  productName: z.string().optional(),
  categoryId: z.string().optional(),
  active: z.string().optional(),
})

type ProductFiltersSchema = z.infer<typeof productsFiltersSchema>

export function ProductTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const productName = searchParams.get('productName')
  const categoryId = searchParams.get('categoryId')
  const active = searchParams.get('active')

  const { register, handleSubmit, reset, control } =
    useForm<ProductFiltersSchema>({
      defaultValues: {
        productName: productName ?? '',
        categoryId: categoryId ?? 'all',
        active: active ?? 'all',
      },
    })

  function handleFilter(data: ProductFiltersSchema) {
    const productName = data.productName?.toString()
    const categoryId = data.categoryId?.toString()
    const active = data.active?.toString()

    setSearchParams((prev) => {
      if (productName) {
        prev.set('productName', productName)
      } else {
        prev.delete('productName')
      }

      if (categoryId && categoryId !== 'all') {
        prev.set('categoryId', categoryId)
      } else {
        prev.delete('categoryId')
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
      prev.delete('productName')
      prev.delete('categoryId')
      prev.delete('active')
      prev.set('page', '1')

      return prev
    })

    reset({
      productName: '',
      categoryId: 'all',
      active: 'all',
    })
  }

  const hasAnyFilter = !!productName || !!categoryId || !!active

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="flex items-center gap-2"
    >
      <span className="text-sm font-semibold">Filtros:</span>
      <Input
        placeholder="Nome do produto"
        className="h-8 w-[320px]"
        {...register('productName')}
      />
      <Controller
        control={control}
        name="categoryId"
        render={({ field: { name, onChange, value, disabled } }) => {
          return (
            <Select
              name={name}
              onValueChange={onChange}
              value={value}
              disabled={disabled}
            >
              <SelectTrigger className="h-8 w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                {/* TODO: Buscar categorias da API */}
                <SelectItem value="category-1">Lanches</SelectItem>
                <SelectItem value="category-2">Pizzas</SelectItem>
                <SelectItem value="category-3">Bebidas</SelectItem>
              </SelectContent>
            </Select>
          )
        }}
      />
      <Controller
        control={control}
        name="active"
        render={({ field: { name, onChange, value, disabled } }) => {
          return (
            <Select
              name={name}
              onValueChange={onChange}
              value={value}
              disabled={disabled}
            >
              <SelectTrigger className="h-8 w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                <SelectItem value="true">Ativo</SelectItem>
                <SelectItem value="false">Inativo</SelectItem>
              </SelectContent>
            </Select>
          )
        }}
      />

      <Button type="submit" variant="secondary" size="xs">
        <Search className="mr-2 h-4 w-4" />
        Filtrar resultados
      </Button>

      <Button
        type="button"
        variant="outline"
        size="xs"
        disabled={!hasAnyFilter}
        onClick={handleClearFilters}
      >
        <X className="mr-2 h-4 w-4" />
        Remover filtros
      </Button>
    </form>
  )
}
