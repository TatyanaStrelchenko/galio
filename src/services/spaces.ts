import { get, post } from './api'
import { Space } from '../types/space'

export const getSpaces = async () => {
  const { data } = await get<Space[]>('/api/v1/spaces')

  return data
}

export const createSpace = async ({ name }: Partial<Space>) => {
  const { data } = await post<Space>('/api/v1/spaces', {
    name,
  })

  return data
}

export const getPersonalSpace = async () => {
  const { data } = await get<Space>('/api/v1/spaces/personal')

  return data
}
