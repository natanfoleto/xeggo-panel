import { Check, Info, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { AlertDescription } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface AlertAction {
  label: string
  onClick: () => void
}

interface AppAlertProps {
  title: string
  description?: string | null
  timeout?: number
  open: boolean
  onClose?: () => void
  variant?: 'default' | 'success' | 'error'
  action?: AlertAction
}

export function AppAlert({
  title,
  description,
  timeout = 0,
  open,
  onClose,
  variant = 'default',
  action,
}: AppAlertProps) {
  const [visible, setVisible] = useState(false)

  const handleClose = useCallback(() => {
    setVisible(false)
    onClose?.()
  }, [onClose])

  useEffect(() => {
    if (open) {
      setVisible(true)

      if (timeout > 0) {
        const timer = setTimeout(() => {
          handleClose()
        }, timeout)

        return () => clearTimeout(timer)
      }
    }
  }, [handleClose, open, timeout])

  const icon = useMemo(() => {
    switch (variant) {
      case 'default':
        return <Info className="size-10 text-blue-500" />
      case 'success':
        return <Check className="size-10 text-lime-500" />
      case 'error':
        return <X className="size-10 text-red-500" />
      default:
        return null
    }
  }, [variant])

  if (!visible) return null

  return (
    <AlertDialog open={visible}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/0 backdrop-blur-xs">
        <AlertDialogContent
          className="space-y-4"
          aria-describedby={description ? 'dialog-description' : undefined}
          aria-label={!description ? title : undefined}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="flex flex-col items-center justify-center gap-2">
              {icon}
              <span className="text-center">{title}</span>
            </AlertDialogTitle>

            {description && (
              <AlertDescription
                id="dialog-description"
                className="text-muted-foreground justify-center text-center"
              >
                {description}
              </AlertDescription>
            )}
          </AlertDialogHeader>

          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction onClick={action ? action.onClick : handleClose}>
              {action ? action.label : 'Fechar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </div>
    </AlertDialog>
  )
}
