import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { Space } from '../types/space'
import { getPersonalSpace } from '../services/spaces'
import { SpacesProvider } from '../components/Spaces/SpacesProvider'
import { Spinner } from '../components/Spinner/Spinner'
import { MediaChannelScene } from './MediaChannelScene'
import { VideoUrlParams } from '../services/urls'

const Content = styled.div`
  height: 100vh;
  display: flex;
`

const ChannelsContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
`

export const VideoScene = () => {
  const params = useParams<VideoUrlParams>()
  const [loading, setLoading] = useState(true)
  const [space, setSpace] = useState<Space>()

  useEffect(() => {
    const fetchData = async () => {
      const space = await getPersonalSpace()

      setSpace(space)
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading || !space) {
    return <Spinner align="center" />
  }

  return (
    <SpacesProvider initialSpaces={[space]} type="v" hash={params.videoId}>
      <Content>
        <ChannelsContent>
          <MediaChannelScene />
        </ChannelsContent>
      </Content>
    </SpacesProvider>
  )
}
