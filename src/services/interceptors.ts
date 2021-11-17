import axios, { AxiosInstance, AxiosError } from 'axios'

import { refreshAccessToken } from './token'

const identity = (value: any) => value

export const refreshAccessTokenInterceptor = (instance: AxiosInstance) => async (
  error: AxiosError
) => {
  if (
    !axios.isAxiosError(error) ||
    // @ts-ignore
    error.config.skipTokenRefresh ||
    // @ts-ignore
    error.config.tryedToRefreshAccessToken ||
    error.response?.status !== 401
  ) {
    throw error
  }

  // @ts-ignore
  error.config.tryedToRefreshAccessToken = true

  try {
    await refreshAccessToken()
  } catch (e) {}

  return instance(error.config)
}

// @todo: implement ttl
export const applyInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.response.use(identity, refreshAccessTokenInterceptor(instance))
}
