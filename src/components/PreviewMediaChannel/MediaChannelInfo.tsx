import React from 'react'
import styled from 'styled-components'

import { Participant } from '../../types/user'
import { Text } from '../Typography/Text'
import { FlexBox } from '../Box/Box'
import { UsersIcon } from '../Icons/UsersIcon'
import { ClockIcon } from '../Icons/ClockIcon'
import { CallTime } from '../MediaChannel/CallTime'

const IconWrapper = styled(FlexBox)`
  font-size: 24px;
  line-height: 24px;
  color: #308575;

  & + ${Text} {
    margin-left: 8px;
  }
`

const TextGroup = styled(FlexBox)`
  & + & {
    &:before {
      content: '•';
      color: #308575;
      margin: 0 8px;
    }
  }
`

type Props = {
  startTime: string
  participants: Participant[]
}

export const MediaChannelInfo = ({ startTime, participants }: Props) => {
  return (
    <FlexBox>
      <TextGroup alignItems="center">
        <IconWrapper>
          <UsersIcon fill="#c8dfdb" />
        </IconWrapper>
        <Text bold as="span" size="normal">
          {participants.length} participants
        </Text>
      </TextGroup>
      <TextGroup alignItems="center">
        <IconWrapper>
          <ClockIcon fill="#c8dfdb" />
        </IconWrapper>
        <CallTime startTime={startTime} />
      </TextGroup>
    </FlexBox>
  )
}
