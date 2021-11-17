import { useParams } from 'react-router-dom'

import { useSpaces } from '../components/Spaces/SpacesProvider'

type Params = {
  hash?: string
}

export const useVideoHashId = (): string | null => {
  const params = useParams<Params>()
  const { selectedVideoChannel } = useSpaces()

  if (!selectedVideoChannel && !params.hash) {
    return null
  }

  const videoId = selectedVideoChannel?.hash_id || params.hash

  return videoId || null
}
