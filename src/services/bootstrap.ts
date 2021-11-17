import { User } from '../types/user'
import { refreshAccessToken } from './token'
import { getMyUser } from './users'

type BootstrapResult = {
  user: User | null
}

export const bootstrap = async (): Promise<BootstrapResult> => {
  try {
    const user = await getMyUser()

    if (user) {
      await refreshAccessToken()
    }

    return { user }
  } catch (e) {
    console.error('Failed to bootstrap', e)

    return { user: null }
  }
}
