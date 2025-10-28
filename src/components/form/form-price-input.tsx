import { type KeyboardEvent, useEffect, useState } from 'react'

import { FormInput } from '@/components/form/form-input'
import { formatCurrency } from '@/utils/format-currency'

interface PriceInputProps {
  value: number
  onChange: (value: number) => void
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void
  disabled?: boolean
  error?: string
  className?: string
}

export function FormPriceInput({
  value,
  onChange,
  onKeyDown,
  disabled,
  error,
  className,
}: PriceInputProps) {
  const [displayValue, setDisplayValue] = useState<string>(
    formatCurrency(value / 100),
  )

  useEffect(() => {
    setDisplayValue(formatCurrency(value / 100))
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    const onlyNumbers = inputValue.replace(/\D/g, '')

    if (onlyNumbers === '') {
      setDisplayValue('0,00')
      onChange(0)
      return
    }

    const cents = parseInt(onlyNumbers, 10)

    setDisplayValue(formatCurrency(cents / 100))

    onChange(cents)
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  return (
    <FormInput
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      onFocus={handleFocus}
      disabled={disabled}
      error={error}
      className={className}
    />
  )
}
