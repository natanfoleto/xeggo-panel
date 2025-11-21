import { Calendar, ChevronDown, ChevronUp, Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { OrderStatus } from '@/components/order-status'
import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Input } from '@/components/ui/input'

type OrderStatusType =
  | 'awaiting_payment'
  | 'payment_failed'
  | 'payment_confirmed'
  | 'payment_overdue'
  | 'payment_refunded'
  | 'chargeback_requested'
  | 'pending'
  | 'processing'
  | 'delivering'
  | 'delivered'
  | 'canceled'

const statusOptions: Array<{ value: OrderStatusType; label: string }> = [
  { value: 'awaiting_payment', label: 'Aguardando pagamento' },
  { value: 'payment_failed', label: 'Pagamento falhou' },
  { value: 'payment_confirmed', label: 'Pagamento confirmado' },
  { value: 'pending', label: 'Pendente' },
  { value: 'processing', label: 'Em preparo' },
  { value: 'delivering', label: 'Em entrega' },
  { value: 'delivered', label: 'Entregue' },
  { value: 'canceled', label: 'Cancelado' },
]

const otherStatusOptions: Array<{ value: OrderStatusType; label: string }> = [
  { value: 'payment_overdue', label: 'Pagamento vencido' },
  { value: 'payment_refunded', label: 'Reembolsado' },
  { value: 'chargeback_requested', label: 'Contestação solicitada' },
]

const ordersFiltersSchema = z.object({
  orderId: z.string().optional(),
  customerName: z.string().optional(),
  status: z.string().optional(),
})

type OrderFiltersSchema = z.infer<typeof ordersFiltersSchema>

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

  const [showOtherStatusOrders, setShowOtherStatusOrders] = useState(false)

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<OrderFiltersSchema>({
      defaultValues: {
        orderId: orderId ?? '',
        customerName: customerName ?? '',
        status: status ?? 'all',
      },
    })

  const currentStatus = watch('status') as OrderStatusType
  const watchedCustomerName = watch('customerName')

  useEffect(() => {
    const currentCustomerNameInURL = searchParams.get('customerName') ?? ''

    if (watchedCustomerName === currentCustomerNameInURL) return

    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        if (watchedCustomerName) prev.set('customerName', watchedCustomerName)
        else prev.delete('customerName')

        prev.set('page', '1')

        return prev
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [watchedCustomerName, searchParams, setSearchParams])

  useEffect(() => {
    const currentFrom = searchParams.get('from')
    const currentTo = searchParams.get('to')

    const newFrom = period?.from?.toISOString()
    const newTo = period?.to?.toISOString()

    if (newFrom && newTo) {
      if (currentFrom === newFrom && currentTo === newTo) return

      setSearchParams((prev) => {
        prev.set('from', newFrom)
        prev.set('to', newTo)
        prev.set('page', '1')
        return prev
      })
    } else if (!period?.from && !period?.to) {
      if (!currentFrom && !currentTo) return

      setSearchParams((prev) => {
        prev.delete('from')
        prev.delete('to')
        prev.set('page', '1')
        return prev
      })
    }
  }, [period, setSearchParams, searchParams])

  function onSubmit(data: OrderFiltersSchema) {
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

    handleSubmit(onSubmit)()
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Input
              placeholder="ID do pedido"
              className="h-8"
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
            className="h-8 w-full lg:w-96"
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

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={currentStatus === option.value ? 'default' : 'outline'}
              size="xs"
              onClick={() => handleStatusChange(option.value)}
              className="w-auto"
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

          {showOtherStatusOrders &&
            otherStatusOptions.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={currentStatus === option.value ? 'default' : 'outline'}
                size="xs"
                onClick={() => handleStatusChange(option.value)}
                className="w-auto"
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

          {!showOtherStatusOrders &&
            currentStatus &&
            otherStatusOptions.some(
              (status) => status.value === currentStatus,
            ) && (
              <Button
                type="button"
                variant="default"
                size="xs"
                onClick={() => handleStatusChange(currentStatus)}
                className="w-auto"
              >
                <OrderStatus
                  status={currentStatus}
                  className="text-background"
                />
              </Button>
            )}

          {showOtherStatusOrders ? (
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => setShowOtherStatusOrders(false)}
              className="text-muted-foreground w-auto"
            >
              Menas opções
              <ChevronUp />
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => setShowOtherStatusOrders(true)}
              className="text-muted-foreground w-auto"
            >
              Mais opções
              <ChevronDown />
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
