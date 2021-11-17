import { post, get } from './api'

import { VideoChannel, VideoChannelInfo } from '../types/space'

export const createVideoChannel = async (name: string, videoChannelId?: string) => {
  const { data } = await post<VideoChannel>('/api/v1/video-channels', {
    name,
    videoChannelId,
  })

  return data
}

export const getVideoChannelInfo = async (hashId: string) => {
  const { data } = await get<VideoChannelInfo>(`/api/v1/video-channels/${hashId}/info`)

  return data
}
