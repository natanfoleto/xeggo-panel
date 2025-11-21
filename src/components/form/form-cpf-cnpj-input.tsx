import { useEffect, useState } from 'react'

import { FormInput } from '@/components/form/form-input'

interface CpfCnpjInputProps {
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
  error?: string
}

export function FormCpfCnpjInput({
  value = '',
  onChange,
  disabled,
  className,
  error,
}: CpfCnpjInputProps) {
  useEffect(() => {
    setDisplayValue(formatCpfCnpj(value))
  }, [value])

  const formatCpfCnpj = (v: string): string => {
    if (!v) return ''

    const n = v.replace(/\D/g, '')

    if (n.length <= 11) {
      if (n.length <= 3) return n
      if (n.length <= 6) return `${n.slice(0, 3)}.${n.slice(3)}`
      if (n.length <= 9)
        return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6)}`
      return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9, 11)}`
    }

    if (n.length <= 14) {
      if (n.length <= 2) return n
      if (n.length <= 5) return `${n.slice(0, 2)}.${n.slice(2)}`
      if (n.length <= 8)
        return `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5)}`
      if (n.length <= 12)
        return `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5, 8)}/${n.slice(8)}`
      return `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5, 8)}/${n.slice(8, 12)}-${n.slice(12, 14)}`
    }

    return v
  }

  const [displayValue, setDisplayValue] = useState<string>(formatCpfCnpj(value))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')

    if (raw.length > 14) return

    setDisplayValue(formatCpfCnpj(raw))

    onChange(raw)
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
      placeholder="012.345.678-90"
      maxLength={18}
    />
  )
}
