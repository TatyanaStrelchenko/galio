import React, { useEffect, useRef, useCallback, useState } from 'react'
import styled from 'styled-components'

import {
  getAudioStream,
  getVideoStream,
  isAudioTrackEnabled,
  stopMediaStream,
  toggleTracks,
} from '../services/stream'
import { useMediaChannel } from '../components/MediaChannel/MediaChannelProvider'
import {
  useIsParticipantLoading,
  useMyParticipants,
} from '../components/MediaChannel/ParticipantsProvider'
import { useSpaces } from '../components/Spaces/SpacesProvider'
import { useUser } from '../components/User/UserProvider'
import { useMyMediaStream } from '../components/Me/MyMediaStreamProvier'
import { FlexBox, Box } from '../components/Box/Box'
import { Text } from '../components/Typography/Text'
import { Participants } from '../components/PreviewMediaChannel/Participants'
import { Controls } from '../components/PreviewMediaChannel/Controls'
import { Spinner } from '../components/Spinner/Spinner'
import { VideoPreview } from '../components/PreviewMediaChannel/VideoPreview'
import { VolumePreview } from '../components/PreviewMediaChannel/VolumePreview'

const Container = styled(FlexBox)`
  height: 100%;
  background: #f9f9f9;
  overflow-y: auto;
`

const VideoHolder = styled.div`
  width: 464px;
  height: calc(100% - 70px);
  margin: 0 auto;

  @media (min-width: 1280px) and (max-height: 720px) {
    width: 464px;
  }

  @media (min-width: 1024px) and (min-height: 768px) {
    width: 600px;
  }

  @media (min-width: 1280px) and (min-height: 960px) {
    width: 800px;
  }

  @media (min-width: 1480px) {
    width: 800px;
  }
`

const PreviewContainer = styled(Box)`
  padding: 16px 16px 12px;
  height: calc(100% - 285px);
  min-height: 408px;
`

type Props = {
  startTime: string
  onJoin: () => void
}

export const PreviewMediaChannelScene = ({ startTime, onJoin }: Props) => {
  const isUnmountedRef = useRef(false)
  const isJoinedRef = useRef(false)

  const mediaChannel = useMediaChannel()
  const participants = useMyParticipants()
  const isParticipantLoading = useIsParticipantLoading()
  const { selectedVideoChannel } = useSpaces()
  const { user } = useUser()
  const { audioStream, videoStream, setAudioStream, setVideoStream } = useMyMediaStream()
  const [handlingVideo, setHandlingVideo] = useState(false)
  const [handlingAudio, setHandlingAudio] = useState(false)
  const [isAudioEnabled, setAudioEnabled] = useState(false)

  useEffect(() => {
    return () => {
      isUnmountedRef.current = true
    }
  }, [])

  useEffect(() => {
    const stopTracks = () => {
      if (!isJoinedRef.current) {
        const eraseStream = (mediaStream: MediaStream | null) => {
          stopMediaStream(mediaStream)

          return null
        }

        setAudioStream(eraseStream)
        setVideoStream(eraseStream)
      }
    }

    return stopTracks
  }, [setAudioStream, setVideoStream])

  useEffect(() => {
    mediaChannel.previewRoom()
  }, [mediaChannel])

  const requestAudioStream = useCallback(async () => {
    setHandlingAudio(true)

    try {
      const audioStream = await getAudioStream()

      isUnmountedRef.current ? stopMediaStream(audioStream) : setAudioStream(audioStream)
    } catch (e) {
      console.log('Failed to request audio stream', e)
    } finally {
      setHandlingAudio(false)
    }
  }, [setAudioStream])

  const requestVideoStream = useCallback(async () => {
    setHandlingVideo(true)

    try {
      const videoStream = await getVideoStream()

      isUnmountedRef.current ? stopMediaStream(videoStream) : setVideoStream(videoStream)
    } catch (e) {
      console.log('Failed to request video stream', e)
    } finally {
      setHandlingVideo(false)
    }
  }, [setVideoStream])

  useEffect(() => {
    if (isUnmountedRef.current) {
      return
    }

    requestAudioStream()
    requestVideoStream()
  }, [requestAudioStream, requestVideoStream])

  useEffect(() => {
    setAudioEnabled(isAudioTrackEnabled(audioStream))
  }, [audioStream])

  const handleJoinClick = async () => {
    isJoinedRef.current = true

    onJoin()
  }

  const handleAudioClick = async () => {
    if (handlingAudio) {
      return
    }

    if (audioStream) {
      const audioTracks = audioStream.getAudioTracks()

      toggleTracks(audioTracks)
      setAudioEnabled(Boolean(audioTracks?.[0].enabled))
    } else {
      await requestAudioStream()
    }
  }

  const handleVideoClick = async () => {
    if (handlingVideo) {
      return
    }

    if (videoStream) {
      stopMediaStream(videoStream)
      setVideoStream(null)
    } else {
      await requestVideoStream()
    }
  }

  if (isParticipantLoading) {
    return <Spinner align="center" />
  }

  return (
    <Container direction="column">
      <PreviewContainer textAlign="center">
        <Text bold size="big" align="center">
          You are about to join&nbsp;
          <Text as="span" bold variant="success">
            {selectedVideoChannel?.name}
          </Text>
          . Make sure your video and audio work correctly
        </Text>
        <VideoHolder>
          <VideoPreview user={user} />
          <VolumePreview />
        </VideoHolder>
        <Controls
          startTime={startTime}
          participants={participants}
          isAudioEnabled={isAudioEnabled}
          onJoinClick={handleJoinClick}
          onAudioClick={handleAudioClick}
          onVideoClick={handleVideoClick}
        />
      </PreviewContainer>
      <Participants participants={participants} />
    </Container>
  )
}
