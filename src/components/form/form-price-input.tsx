import { useState } from 'react'

import { FormInput } from '@/components/form/form-input'

interface PriceInputProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  error?: string
}

export function FormPriceInput({
  value,
  onChange,
  disabled,
  error,
}: PriceInputProps) {
  const formatCentsToReal = (cents: number): string => {
    const reais = cents / 100
    return reais.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const [displayValue, setDisplayValue] = useState<string>(
    formatCentsToReal(value),
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    const onlyNumbers = inputValue.replace(/\D/g, '')

    if (onlyNumbers === '') {
      setDisplayValue('0,00')
      onChange(0)
      return
    }

    const cents = parseInt(onlyNumbers, 10)

    setDisplayValue(formatCentsToReal(cents))
    onChange(cents)
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  return (
    <div className="relative">
      <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm">
        R$
      </span>

      <FormInput
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        disabled={disabled}
        error={error}
        className="pl-10"
      />
    </div>
  )
}
