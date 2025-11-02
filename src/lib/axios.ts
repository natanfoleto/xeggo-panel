import axios from 'axios'

import { env } from '@/env'

const authAPI = axios.create({
  baseURL: env.VITE_AUTH_API_URL,
  withCredentials: true,
})

const deauthAPI = axios.create({
  baseURL: env.VITE_DEAUTH_API_URL,
  withCredentials: true,
})

if (env.VITE_ENABLE_API_DELAY) {
  for (const instance of [authAPI, deauthAPI]) {
    instance.interceptors.request.use(async (config) => {
      await new Promise((resolve) =>
        setTimeout(resolve, Math.round(Math.random() * 4000)),
      )

      return config
    })
  }
}

export const api = {
  auth: authAPI,
  deauth: deauthAPI,
}
