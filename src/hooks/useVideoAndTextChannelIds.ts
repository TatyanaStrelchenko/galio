import { useParams } from 'react-router-dom'

type SpaceParams = {
  vOrT: string
}

type VideoAndTextChannelIds = {
  textChannelId?: string
  videoChannelId?: string
}

const emptyIds: VideoAndTextChannelIds = {
  textChannelId: undefined,
  videoChannelId: undefined,
}

const isVideoChannelId = (id?: string) => {
  return Boolean(id && id[0] === 'v')
}

const getChannelId = (videoOrTextId?: string): Partial<VideoAndTextChannelIds> => {
  if (!videoOrTextId) {
    return {}
  }

  const id = videoOrTextId.slice(1)

  if (isVideoChannelId(videoOrTextId)) {
    return { videoChannelId: id }
  }

  return { textChannelId: id }
}

export const parseFromParam = (ids: string): VideoAndTextChannelIds => {
  const [first, second] = ids.split('_')

  return {
    ...emptyIds,
    ...getChannelId(first),
    ...getChannelId(second),
  }
}

export const useVideoAndTextChannelIds = (): VideoAndTextChannelIds => {
  const params = useParams<SpaceParams>()
  const ids = params.vOrT

  if (!ids) {
    return emptyIds
  }

  return parseFromParam(ids)
}
