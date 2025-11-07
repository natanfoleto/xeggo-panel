import { QueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

import { appalert } from '@/components/app-alert/app-alert-context'

let displayedNetworkFailureError = false

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry(failureCount) {
        if (failureCount >= 3) {
          if (displayedNetworkFailureError === false) {
            displayedNetworkFailureError = true

            appalert.error(
              'A aplicação está demorando mais que o esperado para carregar, tente novamente em alguns minutos.',
              {
                onDismiss: () => {
                  displayedNetworkFailureError = false
                },
              },
            )
          }

          return false
        }

        return true
      },
    },
    mutations: {
      onError(error) {
        if (isAxiosError(error)) {
          if ('message' in error.response?.data) {
            appalert.error(error.response?.data.message)
          } else {
            appalert.error('Erro ao processar operação.')
          }
        }
      },
    },
  },
})
