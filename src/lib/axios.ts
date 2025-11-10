import axios from 'axios'

import { env } from '@/env'

const publicAPI = axios.create({
  baseURL: env.VITE_PUBLIC_API_URL,
  withCredentials: true,
})

const managerAPI = axios.create({
  baseURL: env.VITE_MANAGER_API_URL,
  withCredentials: true,
})

if (env.VITE_ENABLE_API_DELAY) {
  for (const instance of [publicAPI, managerAPI]) {
    instance.interceptors.request.use(async (config) => {
      await new Promise((resolve) =>
        setTimeout(resolve, Math.round(Math.random() * 4000)),
      )

      return config
    })
  }
}

export const api = {
  public: publicAPI,
  manager: managerAPI,
}
