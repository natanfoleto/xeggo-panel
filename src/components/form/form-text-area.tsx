import { FormError } from '@/components/form/form-error'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface FormTextareaProps extends React.ComponentProps<'textarea'> {
  error?: string
}

export function FormTextarea({ error, className, ...rest }: FormTextareaProps) {
  return (
    <div className="flex-1 space-y-1">
      <Textarea
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
