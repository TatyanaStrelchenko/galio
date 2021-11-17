import React from 'react'
import styled from 'styled-components'

import { Participant as ParticipantType } from '../../types/user'
import { Box, FlexBox } from '../Box/Box'
import { Avatar as BaseAvatar } from '../Avatar/Avatar'
import { Text, truncateMixin } from '../Typography/Text'
import { MicMuteIcon } from '../Icons/MicMuteIcon'
import { MicIcon } from '../Icons/MicIcon'
import { CameraVideoIcon } from '../Icons/CameraVideoIcon'
import { CameraVideoOffIcon } from '../Icons/CameraVideoOffIcon'

const AVATAR_SIZE = 64

const Avatar = styled(BaseAvatar)`
  margin-top: 8px;
  width: 100%;
  height: auto;
  max-width: 64px;
  max-height: 64px;
`

const Container = styled(Box)`
  position: relative;
  margin: 8px;
  padding: 8px;
  background: #ffffff;
  border-radius: 8px;
  min-width: 185px;
  height: 120px;
`

const Title = styled(Text)`
  margin-top: 12px;
`

const IconsWrapper = styled.span`
  position: absolute;
  left: 0;
  margin-left: 8px;
  display: inline-flex;
  font-size: 14px;
  line-height: 14px;

  svg + svg {
    margin-left: 8px;
  }
`

const Name = styled.span`
  ${truncateMixin}
`

type Props = {
  participant: ParticipantType
}

export const Participant = ({ participant }: Props) => {
  return (
    <Container textAlign="center">
      <IconsWrapper>
        {participant.micEnabled ? <MicIcon /> : <MicMuteIcon />}
        {participant.cameraEnabled ? <CameraVideoIcon /> : <CameraVideoOffIcon />}
      </IconsWrapper>
      <Avatar user={participant} size={AVATAR_SIZE} />
      <Title bold size="small" align="center">
        <FlexBox alignItems="center" justifyContent="center">
          <Name>{participant.name}</Name>
        </FlexBox>
      </Title>
    </Container>
  )
}
