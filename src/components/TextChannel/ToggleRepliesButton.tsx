import React from 'react'
import styled from 'styled-components'

import { MessageTree } from '../../types/space'
import { Button } from '../Button/Button'
import { ExpandArrowIcon } from '../Icons/ExpandArrowIcon'

const IconWrapper = styled.span`
  font-size: 16px;
`

type Props = {
  showReplies: boolean
  message: MessageTree
  onClick: () => void
}

export const ToggleRepliesButton = ({ showReplies, message, onClick }: Props) => {
  return (
    <Button size="small" variant="link" onClick={onClick}>
      {showReplies ? 'Hide' : 'Show'} {message.replies_count} Replies
      <IconWrapper>
        <ExpandArrowIcon direction={showReplies ? 'up' : 'down'} />
      </IconWrapper>
    </Button>
  )
}
