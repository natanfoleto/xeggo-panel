import { FormError } from '@/components/form/form-error'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface FormInputProps extends React.ComponentProps<'input'> {
  error?: string
}

export function FormInput({ error, className, ...rest }: FormInputProps) {
  return (
    <div className="flex-1 space-y-1">
      <Input
        {...rest}
        className={cn(
          error ? 'border-red-400 disabled:opacity-1' : '',
          className,
        )}
      />

      {error && <FormError error={error} />}
    </div>
  )
}
