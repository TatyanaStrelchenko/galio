import React from 'react'
import styled, { keyframes } from 'styled-components'

import { useMyMediaStream } from '../Me/MyMediaStreamProvier'
import { Box } from '../Box/Box'
import { Button, ButtonGroup } from '../Button/Button'
import { MicIcon } from '../Icons/MicIcon'
import { MicMuteIcon } from '../Icons/MicMuteIcon'
import { CameraVideoIcon } from '../Icons/CameraVideoIcon'
import { CameraVideoOffIcon } from '../Icons/CameraVideoOffIcon'
import { ArrowRightIcon } from '../Icons/ArrowRightIcon'
import { MediaChannelInfo } from './MediaChannelInfo'
import { Participant as ParticipantType } from '../../types/user'

const TextButton = styled.span`
  width: 0;
  transition: width 0.5s;
  overflow: hidden;
`
const animate = keyframes`
    0% {transform: translateX(5px)}
   50% {transform: translateX(-10px)}
   100% {transform: translateX(0);}
`

const Mask = styled.span`
  position: absolute;
  right: -16px;
  background: #308575;
  min-height: 40px;
  min-width: 40px;
  border-radius: 50%;
  overflow: hidden;
  z-index: -1;
`

const ButtonAnimated = styled(Button)`
  position: absolute;
  left: 0;
  width: 40px;
  transition: all 0.25s linear;

  &:hover {
    width: 96px;
    border-radius: 55px;
  }

  &:hover ${TextButton} {
    width: auto;
    overflow: visible;
  }

  &:hover ${Mask} {
    display: block;
    overflow: visible;
    animation: ${animate} 0.25s ease 0.25s;
  }

  & > div {
    right: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`

const ButtonHolder = styled.div`
  display: inline-block;
  vertical-align: top;
  width: 56px;
  position: relative;
  margin-left: 16px;
`

const Panel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  position: relative;
`

const MediaChannelInfoHolder = styled.div`
  position: absolute;
  left: 16px;
  top: 10px;
`

type Props = {
  startTime: string
  participants: ParticipantType[]
  isAudioEnabled: boolean
  onJoinClick: () => void
  onAudioClick: () => void
  onVideoClick: () => void
  audioButtonDisabled?: boolean
  videoButtonDisabled?: boolean
}

export const Controls = ({
  startTime,
  onJoinClick,
  participants,
  audioButtonDisabled,
  videoButtonDisabled,
  isAudioEnabled,
  onAudioClick,
  onVideoClick,
}: Props) => {
  const { videoStream } = useMyMediaStream()

  const VideoIcon = videoStream ? CameraVideoIcon : CameraVideoOffIcon
  const AudioIcon = isAudioEnabled ? MicIcon : MicMuteIcon

  return (
    <Panel>
      <MediaChannelInfoHolder>
        <MediaChannelInfo startTime={startTime} participants={participants} />
      </MediaChannelInfoHolder>
      <Box textAlign="center">
        <ButtonGroup padding="normal">
          <Button
            circle
            size="large"
            variant="light"
            active={!isAudioEnabled}
            disabled={audioButtonDisabled}
            onClick={onAudioClick}
            title={!isAudioEnabled ? 'Turn on microphone' : 'Turn off microphone'}
          >
            <AudioIcon />
          </Button>
          <Button
            circle
            size="large"
            variant="light"
            active={!Boolean(videoStream)}
            disabled={videoButtonDisabled}
            onClick={onVideoClick}
            title={!Boolean(videoStream) ? 'Turn on camera' : 'Turn off camera'}
          >
            <VideoIcon />
          </Button>
          <ButtonHolder>
            <ButtonAnimated
              circle
              size="large"
              variant="success"
              onClick={onJoinClick}
              title="Join to call"
            >
              <TextButton>Join</TextButton>
              <ArrowRightIcon />
              <Mask />
            </ButtonAnimated>
          </ButtonHolder>
        </ButtonGroup>
      </Box>
    </Panel>
  )
}
