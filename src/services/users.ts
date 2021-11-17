import { Space } from '../types/space'
import { User } from '../types/user'
import { get } from './api'

const SIZE_REGEXP = /(s(\d+)-c)/i

export const changeUserAvatarSize = (avatarUrl: string, size: number) => {
  return avatarUrl.replace(SIZE_REGEXP, `s${size}-c`)
}

export const getUsers = async (space: Space) => {
  const { data } = await get<User[]>(`/api/v1/spaces/${space.id}/users`)

  return data
}

export const getMyUser = async () => {
  const { data } = await get<User>('/api/v1/users/me')

  return data
}
