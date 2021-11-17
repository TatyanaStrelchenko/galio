import { put } from './api'

export const refreshAccessToken = async () => {
  await put('/api/v1/auth', undefined, {
    // @ts-ignore
    skipTokenRefresh: true,
  })
}
