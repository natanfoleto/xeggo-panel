import axios from 'axios'

import { env } from '@/env'

const apiPrivate = axios.create({
  baseURL: env.VITE_PRIVATE_API_URL,
  withCredentials: true,
})

const apiPublic = axios.create({
  baseURL: env.VITE_PUBLIC_API_URL,
  withCredentials: true,
})

if (env.VITE_ENABLE_API_DELAY) {
  for (const instance of [apiPrivate, apiPublic]) {
    instance.interceptors.request.use(async (config) => {
      await new Promise((resolve) =>
        setTimeout(resolve, Math.round(Math.random() * 4000)),
      )
      return config
    })
  }
}

export const api = {
  private: apiPrivate,
  public: apiPublic,
}
