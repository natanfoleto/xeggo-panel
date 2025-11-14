import { useEffect, useState } from 'react'

import { FormInput } from '@/components/form/form-input'

interface PhoneInputProps {
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
  error?: string
}

export function FormPhoneInput({
  value = '',
  onChange,
  disabled,
  className,
  error,
}: PhoneInputProps) {
  useEffect(() => {
    setDisplayValue(formatPhone(value))
  }, [value])

  const formatPhone = (phone: string): string => {
    if (!phone) return ''

    const onlyNumbers = phone.replace(/\D/g, '')

    if (onlyNumbers.length === 0) return ''
    if (onlyNumbers.length <= 2) return `(${onlyNumbers}`
    if (onlyNumbers.length <= 6) {
      return `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(2)}`
    }
    if (onlyNumbers.length <= 10) {
      return `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(2, 6)}-${onlyNumbers.slice(6)}`
    }

    return `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(2, 7)}-${onlyNumbers.slice(7, 11)}`
  }

  const [displayValue, setDisplayValue] = useState<string>(formatPhone(value))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const onlyNumbers = inputValue.replace(/\D/g, '')

    if (onlyNumbers.length > 11) return

    setDisplayValue(formatPhone(onlyNumbers))
    onChange(onlyNumbers)
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
      onFocus={handleFocus}
      disabled={disabled}
      error={error}
      className={className}
      placeholder="(99) 99999-9999"
      maxLength={15}
    />
  )
}
