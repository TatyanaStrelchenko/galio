import React from 'react'
import styled from 'styled-components'

import { Participant as ParticipantType } from '../../types/user'
import { Box, FlexBox } from '../Box/Box'
import { EmptyRoom } from './EmptyRoom'
import { ParticipantsSlider } from './ParticipantsSlider'

const Container = styled(FlexBox)`
  padding: 8px 16px;
  height: 270px;
`
type Props = {
  participants: ParticipantType[]
}

export const Participants = ({ participants }: Props) => {
  return (
    <Container direction="column" flexGrow={1}>
      {participants.length === 0 ? (
        <EmptyRoom />
      ) : (
        <Box>
          <ParticipantsSlider participants={participants} />
        </Box>
      )}
    </Container>
  )
}
