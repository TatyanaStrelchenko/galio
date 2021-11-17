import axios from 'axios'

export const get = async <T>(url: string) => {
  return axios.get<T>(url, {
    responseType: 'text',
  })
}
