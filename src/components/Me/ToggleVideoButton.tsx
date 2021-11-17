import React from 'react'

import { useMediaChannel } from '../MediaChannel/MediaChannelProvider'
import { useMyMediaStream } from './MyMediaStreamProvier'
import { useMyProducers } from './MyPrdoducersProvider'
import { Button } from '../Button/Button'
import { CameraVideoIcon } from '../Icons/CameraVideoIcon'
import { CameraVideoOffIcon } from '../Icons/CameraVideoOffIcon'
import { getVideoStream } from '../../services/stream'
import styled from 'styled-components'

const ButtonVideo = styled(Button)`
  &:hover {
    background: #a4a4a4;
    border-color: #a4a4a4;
  }
`

export const ToggleVideoButton = () => {
  const mediaChannel = useMediaChannel()
  const { videoStream, setVideoStream } = useMyMediaStream()
  const { videoProducer, setVideoProducer } = useMyProducers()

  const startVideo = async () => {
    try {
      const mediaStream = videoStream ?? (await getVideoStream())

      const videoProducer = await mediaChannel.produceVideo(mediaStream)

      setVideoStream(mediaStream)
      setVideoProducer(videoProducer)
    } catch (e) {
      console.log('Failed to start video', e)
    }
  }

  const stopVideo = async () => {
    if (!videoProducer) {
      console.log('video producerId is undefined')
      return
    }

    try {
      await mediaChannel.closeProducer(videoProducer.id)

      setVideoStream(null)
      setVideoProducer(null)
    } catch (e) {
      console.log('Failed to close video stream', e)
    }
  }

  const handleVideoToggle = () => {
    videoProducer ? stopVideo() : startVideo()
  }

  return (
    <ButtonVideo
      circle
      size="large"
      variant={!videoProducer ? 'light' : 'secondary'}
      onClick={handleVideoToggle}
      title={!videoProducer ? 'Turn on camera' : 'Turn off camera'}
    >
      {!videoProducer ? <CameraVideoOffIcon /> : <CameraVideoIcon />}
    </ButtonVideo>
  )
}
