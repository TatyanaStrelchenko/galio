import React, { useEffect, useState } from 'react'

import { useMyProducers } from './MyPrdoducersProvider'
import { useMediaChannel } from '../MediaChannel/MediaChannelProvider'
import { useMyMediaStream } from './MyMediaStreamProvier'
import { Button } from '../Button/Button'
import { MicIcon } from '../Icons/MicIcon'
import { MicMuteIcon } from '../Icons/MicMuteIcon'
import { isAudioTrackEnabled } from '../../services/stream'
import styled from 'styled-components'

const ButtonMic = styled(Button)`
  &:hover {
    background: #a4a4a4;
    border-color: #a4a4a4;
  }
`

export const ToggleMic = () => {
  const [paused, setPaused] = useState(false)
  const [loading, setLoading] = useState(false)
  const mediaChannel = useMediaChannel()
  const { audioProducer, setAudioProducer } = useMyProducers()
  const { audioStream } = useMyMediaStream()

  useEffect(() => {
    setPaused(!isAudioTrackEnabled(audioStream))
  }, [audioStream, audioProducer])

  useEffect(() => {
    if (!audioProducer) {
      return
    }

    setPaused(audioProducer.paused)

    const handlePause = () => setPaused(true)
    const handleResume = () => setPaused(false)

    audioProducer.observer.on('pause', handlePause)
    audioProducer.observer.on('resume', handleResume)

    return () => {
      audioProducer.observer.off('pause', handlePause)
      audioProducer.observer.off('resume', handleResume)
    }
  }, [audioProducer])

  const handleClick = async () => {
    setLoading(true)

    try {
      if (audioStream && !audioProducer) {
        audioStream.getAudioTracks().forEach((track, index) => {
          track.enabled = !track.enabled

          if (index === 0) {
            setPaused(track.enabled)
          }
        })

        const nextAudioProducer = await mediaChannel.produceAudio(audioStream)

        setAudioProducer(nextAudioProducer)

        return
      }

      if (!audioProducer) {
        return
      }

      audioProducer.paused
        ? await mediaChannel.resumeMic(audioProducer)
        : await mediaChannel.pauseMic(audioProducer)
    } catch (e) {
      console.log('Error toggle mic', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ButtonMic
      circle
      loading={loading}
      size="large"
      variant={!paused ? 'secondary' : 'light'}
      onClick={handleClick}
      title={!paused ? 'Turn off microphone' : 'Turn on microphone'}
    >
      {!paused ? <MicIcon /> : <MicMuteIcon />}
    </ButtonMic>
  )
}
