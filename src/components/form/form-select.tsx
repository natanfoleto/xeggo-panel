import type { ReactNode } from 'react'

import { FormError } from '@/components/form/form-error'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface FormSelectProps
  extends React.ComponentPropsWithoutRef<typeof Select> {
  error?: string
  children: ReactNode
  className?: string
}

export function FormSelect({
  error,
  children,
  className,
  value,
  ...rest
}: FormSelectProps) {
  return (
    <div className="space-y-1">
      <Select {...rest} value={value}>
        <SelectTrigger
          className={cn(
            value ? 'text-foreground' : 'text-muted-foreground',
            error
              ? 'border-red-400 disabled:opacity-1'
              : 'focus-visible:ring-primary',
            className,
          )}
        >
          <SelectValue placeholder="Selecione uma opção" />
        </SelectTrigger>

        <SelectContent>{children}</SelectContent>
      </Select>

      {error && <FormError error={error} />}
    </div>
  )
}
