import React, { useEffect, useState } from 'react'

import { useMediaChannel } from '../MediaChannel/MediaChannelProvider'
import { useMyMediaStream } from './MyMediaStreamProvier'
import { Button } from '../Button/Button'
import { ShareIcon } from '../Icons/ShareIcon'
import styled from 'styled-components'

const ButtonShare = styled(Button)`
  &:hover {
    background: #a4a4a4;
  }
`

export const ToggleScreenShareButton = () => {
  const mediaChannel = useMediaChannel()
  const { setScreenStream } = useMyMediaStream()
  const [producerId, setProducerId] = useState<string | null>()

  useEffect(() => {
    return () => {
      setScreenStream(null)
      setProducerId(null)
    }
  }, [mediaChannel, setScreenStream])

  const startScreenShare = async () => {
    try {
      // @ts-ignore
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        audio: false,
        video: {
          displaySurface: 'monitor',
          logicalSurface: true,
          cursor: true,
          width: { max: 1024 },
          height: { max: 720 },
          frameRate: { max: 30 },
        },
      })

      const producer = await mediaChannel.produceVideo(mediaStream)

      producer.on('trackended', () => {
        setScreenStream(null)
        setProducerId(null)
      })

      setScreenStream(mediaStream)
      setProducerId(producer.id)
    } catch (e) {
      console.log('Failed to start screen sharing', e)
    }
  }

  const stopScreenShare = async () => {
    if (!producerId) {
      console.log('screen sharing producerId is undefined')
      return
    }

    try {
      await mediaChannel.closeProducer(producerId)

      setScreenStream(null)
      setProducerId(null)
    } catch (e) {
      console.log('Failed to close screen share stream', e)
    }
  }

  const handleScreenShareToggle = () => {
    producerId ? stopScreenShare() : startScreenShare()
  }

  return (
    <ButtonShare
      circle
      disabled={true}
      size="large"
      variant="secondary"
      onClick={handleScreenShareToggle}
      title={producerId ? 'Share now' : 'Stop share'}
    >
      <ShareIcon />
    </ButtonShare>
  )
}
