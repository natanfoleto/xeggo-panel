import { useEffect, useState } from 'react'

import { AppAlert } from './app-alert'

type AlertVariant = 'default' | 'success' | 'error'

interface AlertAction {
  label: string
  onClick: () => void
}

interface AlertState {
  open: boolean
  title: string
  description?: string | null
  variant?: AlertVariant
  timeout?: number
  onDismiss?: () => void
  action?: AlertAction
}

interface AlertOptions {
  timeout?: number
  onDismiss?: () => void
  action?: AlertAction
}

class AlertManager {
  // eslint-disable-next-line no-use-before-define
  private static _instance: AlertManager

  private _setAlertState: ((state: AlertState) => void) | null = null

  // eslint-disable-next-line no-useless-constructor
  private constructor() {}

  static get instance() {
    return this._instance || (this._instance = new AlertManager())
  }

  setStateHandler(setter: (state: AlertState) => void) {
    this._setAlertState = setter
  }

  private _show(
    title: string,
    descriptionOrOptions?: string | AlertOptions | null,
    optionsOrUndefined?: AlertOptions,
  ) {
    let description: string | null = null
    let options: AlertOptions = {}
    let variant: AlertVariant = 'default'

    if (typeof descriptionOrOptions === 'string') {
      description = descriptionOrOptions
      options = optionsOrUndefined || {}
    } else if (
      typeof descriptionOrOptions === 'object' &&
      descriptionOrOptions !== null
    ) {
      options = descriptionOrOptions
    }

    const callerMethod = new Error().stack?.split('\n')[2]?.trim()

    if (callerMethod?.includes('success')) variant = 'success'
    if (callerMethod?.includes('error')) variant = 'error'
    if (callerMethod?.includes('info')) variant = 'default'

    if (this._setAlertState) {
      this._setAlertState({
        open: true,
        title,
        description,
        variant,
        timeout: options.timeout ?? 5000,
        onDismiss: options.onDismiss,
        action: options.action,
      })
    } else {
      console.error(
        'Alert state handler is not set. Make sure AlertProvider is used.',
      )
    }
  }

  success(
    title: string,
    descriptionOrOptions?: string | AlertOptions | null,
    optionsOrUndefined?: AlertOptions,
  ) {
    this._show(title, descriptionOrOptions, optionsOrUndefined)
  }

  error(
    title: string,
    descriptionOrOptions?: string | AlertOptions | null,
    optionsOrUndefined?: AlertOptions,
  ) {
    this._show(title, descriptionOrOptions, optionsOrUndefined)
  }

  info(
    title: string,
    descriptionOrOptions?: string | AlertOptions | null,
    optionsOrUndefined?: AlertOptions,
  ) {
    this._show(title, descriptionOrOptions, optionsOrUndefined)
  }
}

export const appalert = AlertManager.instance

export function AppAlertProvider({ children }: { children: React.ReactNode }) {
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    title: '',
    description: null,
    variant: 'default',
    timeout: 0,
  })

  useEffect(() => {
    appalert.setStateHandler(setAlertState)
  }, [])

  const handleClose = () => {
    if (alertState.onDismiss) alertState.onDismiss()

    setAlertState((prev) => ({
      ...prev,
      open: false,
      onDismiss: undefined,
      action: undefined,
    }))
  }

  return (
    <>
      {children}
      <AppAlert
        title={alertState.title}
        description={alertState.description}
        variant={alertState.variant}
        open={alertState.open}
        timeout={alertState.timeout}
        onClose={handleClose}
        action={alertState.action}
      />
    </>
  )
}
