import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { isAudioTrackEnabled, stopMediaStream } from '../../services/stream'
import { useMediaChannel } from './MediaChannelProvider'
import { MediaDevicesProvider } from '../Media/MediaDevicesProvider'
import { useMyMediaStream } from '../Me/MyMediaStreamProvier'
import { useCurrentSpeakerUser } from '../Speaker/CurrentSpeakerProvider'
import { MyProducersProvider, useMyProducers } from '../Me/MyPrdoducersProvider'
import { ConsumersProvider } from '../Consumers/ConsumersProvider'
import { CurrentSpeakerProvider } from '../Speaker/CurrentSpeakerProvider'
import { AudioConsumers } from '../Consumers/AudioConsumers'
import { MediaChannelErrors } from './MediaChannelErrors'
import { CurrentSpeaker } from '../Speaker/CurrentSpeaker'
import { Participants } from './Participants'
import { useSpaces } from '../Spaces/SpacesProvider'
import { Button } from '../Button/Button'
import { ExpandIcon } from '../Icons/ExpandIcon'
import { MediaChannelInfo } from './MediaChannelInfo'
import { VideoChat } from './VideoChat'
import { useDispatch } from 'react-redux'
import { toggleShowSidebar } from '../../store/ui/ui'
import { Controls } from './Controls'
import { FlexBox } from '../Box/Box'
import { Text } from '../Typography/Text'
import { useUser } from '../User/UserProvider'
import { VideoChannelJoinResult } from '../../types/space'

type MediaChannelWrapperProps = {
  compact: boolean
}

const MediaChannelWrapper = styled.div<MediaChannelWrapperProps>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  position: relative;
  width: 100%;

  video.current-speaker {
    border-radius: 8px;
  }

  &.full-mode {
    height: 100%;
    padding-right: 8px;
  }

  .speaker-media-wrapper {
    height: calc(100vh - 65px);
  }

  .avatar-wrapper {
    background: #1b1b1b;
    border-radius: 8px;
  }

  ${({ compact }) =>
    compact &&
    `
    position: absolute;
    right: 5px;
    top: 59px;
    width: 232px;
    height: 160px;
    border-radius: 8px;
    overflow: hidden;
    z-index: 1;
    
    .avatar-wrapper {
      align-items: normal;
      padding-top: 32px;
      background: rgba(0, 0, 0, 0.51);
    }
    
    img.current-speaker {
      height: 84px;
      width: 84px;
    }
    
    .controls,
    .speaker-media-background {
      visibility: hidden;
    }
    
    .speaker-media-background,
    .speaker-media-wrapper {
      height: 100%;
      padding: 0;
    }
    
    &:hover .controls,
    &:hover .speaker-media-background {
      visibility: visible;
    }
    
    &:hover .speaker-media-wrapper:after {
      content: '';
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%);
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      display: block;
  `}
`

const ExpandButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 8px;
  z-index: 3;

  button {
    min-height: 0;
    min-width: 0;
    background: none;
  }
`

const MainContent = styled(FlexBox)`
  height: calc(100vh - 55px);
  background: black;
  padding: 8px 0 0 8px;
`

const UserName = styled(Text)`
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  padding: 1px 7px;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
`

type Props = {
  onDisconnect: () => void
}

const MediaChannelView = ({ onDisconnect }: Props) => {
  const dispatch = useDispatch()
  const mediaChannel = useMediaChannel()
  const { user } = useUser()
  const currentSpeakerUser = useCurrentSpeakerUser()
  const { audioProducer, videoProducer, setAudioProducer, setVideoProducer } = useMyProducers()
  const { audioStream, videoStream, setAudioStream, setVideoStream } = useMyMediaStream()
  const {
    joinedVideoChannel,
    selectedTextChannel,
    selectedVideoChannel,
    selectVideoChannel,
    setJoinedVideoChannel,
  } = useSpaces()
  const [showVideoChat, setShowVideoChat] = useState(false)
  const [showParticipants, setShowParticipants] = useState(true)
  const [joinResult, setJoinResult] = useState<VideoChannelJoinResult>()

  const compact = Boolean(selectedTextChannel)

  const toggleParticipantsVisibility = () => {
    setShowParticipants(!showParticipants)
  }

  useEffect(() => {
    if (joinedVideoChannel) {
      return
    }

    const joinToRoom = async () => {
      try {
        const joinResult = await mediaChannel.join()

        setJoinedVideoChannel(selectedVideoChannel)
        setJoinResult(joinResult)
        dispatch(toggleShowSidebar(false))

        if (audioStream && isAudioTrackEnabled(audioStream)) {
          const audioProducer = await mediaChannel.produceAudio(audioStream)

          setAudioProducer(audioProducer)
        }

        if (videoStream) {
          const videoProducer = await mediaChannel.produceVideo(videoStream)

          setVideoProducer(videoProducer)
        }
      } catch (e) {
        console.log('FAILED to join to the room', e)
      }
    }

    joinToRoom()
  }, [
    mediaChannel,
    audioStream,
    videoStream,
    setAudioProducer,
    setVideoProducer,
    joinedVideoChannel,
    selectedVideoChannel,
    setJoinedVideoChannel,
    dispatch,
  ])

  useEffect(() => {
    return () => {
      setAudioStream(null)
      setVideoStream(null)
    }
  }, [setAudioStream, setVideoStream])

  useEffect(() => {
    return () => {
      setAudioProducer(null)
      setVideoProducer(null)
    }
  }, [setAudioProducer, setVideoProducer])

  useEffect(() => {
    return () => {
      dispatch(toggleShowSidebar(true))
    }
  }, [dispatch])

  const handleExpandClick = () => {
    selectVideoChannel(selectedVideoChannel)
  }

  const handleDisconnect = async () => {
    try {
      stopMediaStream(audioStream)
      stopMediaStream(videoStream)

      await mediaChannel.disconnect()
      await Promise.all([
        mediaChannel.closeProducer(audioProducer?.id),
        mediaChannel.closeProducer(videoProducer?.id),
      ])

      setJoinedVideoChannel(null)
      onDisconnect()
    } catch (e) {
      console.log('Failed to disconnect from room', e)
    }
  }

  const toggleVideoChatVisibility = () => {
    setShowVideoChat(!showVideoChat)
  }

  return (
    <>
      <MainContent>
        <MediaChannelWrapper compact={compact} className={`${!compact && 'full-mode'}`}>
          {compact && (
            <ExpandButtonWrapper className="controls">
              <Button size="large" variant="ghost" withPadding={false} onClick={handleExpandClick}>
                <ExpandIcon />
              </Button>
            </ExpandButtonWrapper>
          )}
          <MediaChannelErrors />
          <CurrentSpeaker className="current-speaker" />
          <AudioConsumers />
          <VideoChat show={!compact && showVideoChat} />
          {compact && (
            <Controls
              compact={compact}
              onChatClick={toggleVideoChatVisibility}
              onDisconnect={handleDisconnect}
            />
          )}
          {!compact && (
            <UserName align="center" variant="light">
              {currentSpeakerUser?.name || user?.name}
            </UserName>
          )}
        </MediaChannelWrapper>
        {!compact && showParticipants && <Participants />}
      </MainContent>
      {!compact && selectedVideoChannel && (
        <MediaChannelInfo
          channel={selectedVideoChannel}
          joinResult={joinResult}
          compact={compact}
          onChatClick={toggleVideoChatVisibility}
          isShowVideoChat={showVideoChat}
          isShowParticipants={showParticipants}
          onParticipantsClick={toggleParticipantsVisibility}
          onDisconnect={handleDisconnect}
        />
      )}
    </>
  )
}

export const MediaChannel = (props: Props) => {
  return (
    <MediaDevicesProvider>
      <MyProducersProvider>
        <ConsumersProvider>
          <CurrentSpeakerProvider>
            <MediaChannelView {...props} />
          </CurrentSpeakerProvider>
        </ConsumersProvider>
      </MyProducersProvider>
    </MediaDevicesProvider>
  )
}
