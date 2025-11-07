import './index.css'

import { QueryClientProvider } from '@tanstack/react-query'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from 'react-router-dom'

import { AppAlertProvider } from './components/app-alert/app-alert-context'
import { ThemeProvider } from './components/theme-provider'
import { queryClient } from './lib/react-query'
import { router } from './routes'

export function App() {
  return (
    <HelmetProvider>
      <Helmet titleTemplate="%s - Xeggo" />
      <ThemeProvider defaultTheme="light" storageKey="xeggo-theme">
        <AppAlertProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </AppAlertProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}
