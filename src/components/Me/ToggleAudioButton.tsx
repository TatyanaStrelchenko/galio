import React, { useEffect, useState } from 'react'
import { types } from 'mediasoup-client'

import { getAudioStream } from '../../services/stream'
import { useMediaChannel } from '../MediaChannel/MediaChannelProvider'
import { useMyProducers } from './MyPrdoducersProvider'
import { useMyMediaStream } from './MyMediaStreamProvier'
import { Button } from '../Button/Button'
import { PlayCircleIcon } from '../Icons/PlayCircleIcon'
import { StopCircleIcon } from '../Icons/StopCircleIcon'

// todo: remove, not used
export const ToggleAudioButton = () => {
  const mediaChannel = useMediaChannel()
  const { setAudioProducer } = useMyProducers()
  const { audioStream, setAudioStream } = useMyMediaStream()
  const [producer, setProducer] = useState<types.Producer | null>()

  useEffect(() => {
    return () => {
      setAudioStream(null)
      setProducer(null)
    }
  }, [mediaChannel, setAudioStream])

  const startAudio = async () => {
    try {
      const mediaStream = await getAudioStream()

      const producer = await mediaChannel.produceAudio(mediaStream)

      setAudioStream(mediaStream)
      setProducer(producer)
      setAudioProducer(producer)
    } catch (e) {
      console.log('Failed to start audio', e)
    }
  }

  const stopAudio = async () => {
    // something strange - server stop tracks ??
    audioStream?.getAudioTracks().forEach((track) => {
      track.stop()
    })

    if (!producer) {
      console.log('audio producerId is undefined')
      return
    }

    try {
      await mediaChannel.closeProducer(producer.id)

      setAudioStream(null)
      setProducer(null)
      setAudioProducer(null)
    } catch (e) {
      console.log('Failed to close audio', e)
    }
  }

  const handleAudioToggle = () => {
    producer ? stopAudio() : startAudio()
  }

  return (
    <Button
      circle
      active={Boolean(audioStream)}
      size="large"
      variant="secondary"
      onClick={handleAudioToggle}
    >
      {audioStream ? <StopCircleIcon /> : <PlayCircleIcon />}
    </Button>
  )
}
