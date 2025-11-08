import { Calendar, Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { OrderStatus } from '@/components/order-status'
import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Input } from '@/components/ui/input'

const ordersFiltersSchema = z.object({
  orderId: z.string().optional(),
  customerName: z.string().optional(),
  status: z.string().optional(),
})

type OrderFiltersSchema = z.infer<typeof ordersFiltersSchema>

type OrderStatusType =
  | 'pending'
  | 'canceled'
  | 'processing'
  | 'delivering'
  | 'delivered'

const statusOptions: Array<{ value: OrderStatusType; label: string }> = [
  { value: 'pending', label: 'Pendente' },
  { value: 'processing', label: 'Em preparo' },
  { value: 'delivering', label: 'Em entrega' },
  { value: 'delivered', label: 'Entregue' },
  { value: 'canceled', label: 'Cancelado' },
]

type QuickDateFilterType = 'today' | 'yesterday' | 'last7days'

export function OrderTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const orderId = searchParams.get('orderId')
  const customerName = searchParams.get('customerName')
  const status = searchParams.get('status')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const [period, setPeriod] = useState<DateRange | undefined>(() => {
    if (from || to) {
      return {
        from: from ? new Date(from) : undefined,
        to: to ? new Date(to) : undefined,
      }
    }
    return undefined
  })

  const [activeQuickFilter, setActiveQuickFilter] =
    useState<QuickDateFilterType | null>(null)

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<OrderFiltersSchema>({
      defaultValues: {
        orderId: orderId ?? '',
        customerName: customerName ?? '',
        status: status ?? 'all',
      },
    })

  const currentStatus = watch('status')
  const watchedCustomerName = watch('customerName')

  useEffect(() => {
    const currentCustomerNameInURL = searchParams.get('customerName') ?? ''

    if (watchedCustomerName === currentCustomerNameInURL) return

    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        if (watchedCustomerName) {
          prev.set('customerName', watchedCustomerName)
        } else {
          prev.delete('customerName')
        }
        prev.set('page', '1')
        return prev
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [watchedCustomerName, searchParams, setSearchParams])

  function handleFilter(data: OrderFiltersSchema) {
    const orderId = data.orderId?.toString()
    const customerName = data.customerName?.toString()
    const status = data.status?.toString()

    setSearchParams((prev) => {
      if (orderId) prev.set('orderId', orderId)
      else prev.delete('orderId')

      if (customerName) prev.set('customerName', customerName)
      else prev.delete('customerName')

      if (status && status !== 'all') prev.set('status', status)
      else prev.delete('status')

      if (period?.from) prev.set('from', period.from.toISOString())
      else prev.delete('from')

      if (period?.to) prev.set('to', period.to.toISOString())
      else prev.delete('to')

      prev.set('page', '1')

      return prev
    })
  }

  function handleStatusChange(statusValue: string) {
    if (currentStatus === statusValue) setValue('status', 'all')
    else setValue('status', statusValue)

    handleSubmit(handleFilter)()
  }

  function handleQuickDateFilter(type: QuickDateFilterType) {
    if (activeQuickFilter === type) {
      setPeriod(undefined)
      setActiveQuickFilter(null)

      setSearchParams((prev) => {
        prev.delete('from')
        prev.delete('to')
        prev.set('page', '1')

        return prev
      })

      return
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const last7days = new Date(today)
    last7days.setDate(last7days.getDate() - 6)

    let newPeriod: DateRange | undefined

    switch (type) {
      case 'today':
        newPeriod = { from: today, to: today }
        break
      case 'yesterday':
        newPeriod = { from: yesterday, to: yesterday }
        break
      case 'last7days':
        newPeriod = { from: last7days, to: today }
        break
    }

    setPeriod(newPeriod)
    setActiveQuickFilter(type)

    setSearchParams((prev) => {
      if (newPeriod?.from) prev.set('from', newPeriod.from.toISOString())
      if (newPeriod?.to) prev.set('to', newPeriod.to.toISOString())

      prev.set('page', '1')

      return prev
    })
  }

  function handleClearFilters() {
    setSearchParams((prev) => {
      prev.delete('orderId')
      prev.delete('customerName')
      prev.delete('status')
      prev.delete('from')
      prev.delete('to')
      prev.set('page', '1')

      return prev
    })

    setPeriod(undefined)
    setActiveQuickFilter(null)

    reset({
      orderId: '',
      customerName: '',
      status: 'all',
    })
  }

  const hasAnyFilter =
    !!orderId ||
    !!customerName ||
    (!!status && status !== 'all') ||
    !!period?.from ||
    !!period?.to

  return (
    <form onSubmit={handleSubmit(handleFilter)} className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Input
              placeholder="ID do pedido"
              className="h-8 w-64"
              {...register('orderId')}
            />

            <Button
              type="submit"
              variant="link"
              size="icon"
              className="absolute right-0 h-8"
            >
              <Search className="text-muted-foreground size-4" />
            </Button>
          </div>

          <Input
            placeholder="Nome do cliente"
            className="h-8 w-96"
            {...register('customerName')}
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="xs"
          disabled={!hasAnyFilter}
          onClick={handleClearFilters}
        >
          <X className="size-4" />
          Remover filtros
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={currentStatus === option.value ? 'default' : 'outline'}
              size="xs"
              onClick={() => handleStatusChange(option.value)}
            >
              <OrderStatus
                status={option.value}
                className={
                  currentStatus === option.value
                    ? 'text-background'
                    : 'text-muted-foreground'
                }
              />
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={activeQuickFilter === 'today' ? 'default' : 'outline'}
            size="xs"
            onClick={() => handleQuickDateFilter('today')}
            className={
              activeQuickFilter === 'today'
                ? 'text-background'
                : 'text-muted-foreground'
            }
          >
            <Calendar className="size-3" />
            Hoje
          </Button>

          <Button
            type="button"
            variant={activeQuickFilter === 'yesterday' ? 'default' : 'outline'}
            size="xs"
            onClick={() => handleQuickDateFilter('yesterday')}
            className={
              activeQuickFilter === 'yesterday'
                ? 'text-background'
                : 'text-muted-foreground'
            }
          >
            <Calendar className="size-3" />
            Ontem
          </Button>

          <Button
            type="button"
            variant={activeQuickFilter === 'last7days' ? 'default' : 'outline'}
            size="xs"
            onClick={() => handleQuickDateFilter('last7days')}
            className={
              activeQuickFilter === 'last7days'
                ? 'text-background'
                : 'text-muted-foreground'
            }
          >
            <Calendar className="size-3" />
            Últimos 7 dias
          </Button>

          <DateRangePicker
            date={period}
            onDateChange={(newPeriod) => {
              setPeriod(newPeriod)
              setActiveQuickFilter(null)
            }}
            className="h-8"
          />
        </div>
      </div>
    </form>
  )
}
