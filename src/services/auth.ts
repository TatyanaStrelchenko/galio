import { get, post } from './api'
import { GoogleAuth } from '../types/auth'
import { User } from '../types/user'

export const getGoogleAuthorizeUrl = async () => {
  const { data } = await get<GoogleAuth>('/api/v1/google-auth')

  return data.authorize_url
}

export const authViaGoogle = async (code: string) => {
  const { data } = await post<User>('/api/v1/google-auth', {
    code,
  })

  return data
}
