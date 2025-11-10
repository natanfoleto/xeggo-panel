import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useLayoutEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { authCheck } from '@/api/manager/profile/auth-check'
import { Header } from '@/components/header'
import { api } from '@/lib/axios'

export function AppLayout() {
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['auth-check'],
    queryFn: authCheck,
    retry: false,
    staleTime: Infinity,
  })

  const isAuthenticated = data?.authenticated === true

  useLayoutEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/sign-in', { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])

  useLayoutEffect(() => {
    const interceptorId = api.manager.interceptors.response.use(
      (response) => response,
      (error) => {
        if (isAxiosError(error)) {
          const status = error.response?.status
          const code = error.response?.data.code

          if (status === 401 && code === 'UNAUTHORIZED') {
            navigate('/sign-in', {
              replace: true,
            })
          }
        }

        return Promise.reject(error)
      },
    )

    return () => {
      api.manager.interceptors.response.eject(interceptorId)
    }
  }, [navigate])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-1">
        <Loader2 className="size-5 animate-spin" />
        <p>Carregando...</p>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="flex min-h-screen flex-col antialiased">
      <Header />

      <div className="flex flex-1 flex-col gap-4 p-6">
        <Outlet />
      </div>
    </div>
  )
}
