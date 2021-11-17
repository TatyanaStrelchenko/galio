import React, { Fragment } from 'react'
import styled from 'styled-components'

import { Participant as ParticipantType } from '../../types/user'
import { getColor } from '../../theme/utils'
import { translucentScrollbarMixin, hiddenScrollbarMixin } from '../Style/Scrollbar'
import { useMyParticipants, useMyUserParticipant } from './ParticipantsProvider'
import { useMyMediaStream } from '../Me/MyMediaStreamProvier'
import { useUserConsumer } from '../Consumers/ConsumersProvider'
import { Avatar } from '../Avatar/Avatar'
import { FlexBox } from '../Box/Box'
import { Text } from '../Typography/Text'
import { Video } from '../Media/Media'
import { MicMuteIcon } from '../Icons/MicMuteIcon'
import { PARTICIPANTS_COUNT_LIMIT_ALIGNED } from '../../utils/constants/mediaChannel'

const ParticipantsContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 172px;
  border-radius: 4px;
  background: #000;
  z-index: 1;
  overflow-y: auto;

  &.full-list {
    justify-content: flex-start;
  }

  ${translucentScrollbarMixin}
  ${hiddenScrollbarMixin}
`

const ParticipantContainer = styled(FlexBox)`
  position: relative;
  width: 164px;
  min-height: 106px;
  padding-top: 14px;
  background: #1b1b1b;
  border-radius: 4px;

  & + & {
    margin-top: 8px;
  }
`

const UserName = styled(Text)`
  font-size: 12px;
  line-height: 14px;
  font-weight: 500;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  color: ${getColor('white')};
  padding: 2px 8px;
  z-index: 1;
`

const VideoContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
`

const IconsWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding: 3px;
  font-size: 12px;
  line-height: 12px;
  color: ${getColor('white')};
  border-radius: 0 0 2px 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;

  svg + svg {
    margin-left: 4px;
  }
`

type ParticipantProps = {
  participant: ParticipantType
  stream?: MediaStream | null
}

const Participant = ({ participant, stream }: ParticipantProps) => {
  return (
    <ParticipantContainer direction="column" alignItems="center" justifyContent="space-between">
      {!participant.micEnabled && (
        <IconsWrapper>
          <MicMuteIcon />
        </IconsWrapper>
      )}
      {stream ? (
        <Fragment>
          <div />
          <VideoContainer>
            <Video kind="video" stream={stream} />
          </VideoContainer>
        </Fragment>
      ) : (
        <Avatar user={participant} />
      )}
      <UserName align="center">{participant.name}</UserName>
    </ParticipantContainer>
  )
}

const ChannelParticipant = ({ participant }: ParticipantProps) => {
  const consumer = useUserConsumer(participant.id, 'video')

  return <Participant participant={participant} stream={consumer?.stream} />
}

export const Participants = () => {
  const myParticipants = useMyParticipants()
  const myUserParticipant = useMyUserParticipant()
  const { videoStream } = useMyMediaStream()
  const faceToFace = myParticipants.length === 1

  const participantsClassName =
    myParticipants.length >= PARTICIPANTS_COUNT_LIMIT_ALIGNED ? 'full-list' : ''

  if (!(myUserParticipant && myParticipants.length)) {
    return null
  }

  return (
    <ParticipantsContainer className={participantsClassName}>
      <Participant participant={myUserParticipant} stream={videoStream} />
      {!faceToFace &&
        myParticipants.map((participant) => (
          <ChannelParticipant key={participant.id} participant={participant} />
        ))}
    </ParticipantsContainer>
  )
}
