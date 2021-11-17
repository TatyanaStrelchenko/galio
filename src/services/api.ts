import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

type DTO<T> = {
  data: T
}
type Result<T> = {
  data: T
  response: AxiosResponse<DTO<T>>
}

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
})

export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<Result<T>> => {
  const response = await api.get<DTO<T>>(url, config)

  return { data: response.data.data, response }
}

export const post = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<Result<T>> => {
  const response = await api.post<DTO<T>>(url, data, config)

  return { data: response.data.data, response }
}

export const put = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<Result<T>> => {
  const response = await api.put<DTO<T>>(url, data, config)

  return { data: response.data.data, response }
}

export const patch = async <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
  const response = await api.patch<DTO<T>>(url, data, config)

  return { data: response.data.data, response }
}
