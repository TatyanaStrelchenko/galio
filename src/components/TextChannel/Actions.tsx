import React from 'react'
import styled from 'styled-components'

import { theme } from '../../theme/theme'
import { Button as BaseButton, ButtonGroup } from '../Button/Button'
import { SavedIcon } from '../Icons/SavedIcon'
import { ChatIcon } from '../Icons/ChatIcon'

const Button = styled(BaseButton)`
  font-size: 14px;
  line-height: 16px;

  svg {
    margin-right: 4px;
  }
`

const Content = styled.div<{ visible: boolean }>`
  display: inline-block;
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
`

type Props = {
  onReply?: () => void
  onSave?: () => void
  visible?: boolean
  isSaved?: boolean
}

export const Actions = ({ onReply, onSave, isSaved = false, visible = false }: Props) => {
  return (
    <Content visible={visible}>
      <ButtonGroup padding="normal">
        {onReply && (
          <Button size="small" variant="link" withPadding={false} onClick={onReply}>
            <ChatIcon /> Reply
          </Button>
        )}
        {onSave && (
          <Button
            size="small"
            variant="link"
            withPadding={false}
            onClick={isSaved ? undefined : onSave}
          >
            <SavedIcon
              stroke={isSaved ? theme.colors.success : 'currentColor'}
              fill={isSaved ? '#c8dfdb' : 'transparent'}
            />
            {isSaved ? 'Saved' : 'Save'}
          </Button>
        )}
      </ButtonGroup>
    </Content>
  )
}
