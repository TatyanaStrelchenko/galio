import React from 'react'
import styled from 'styled-components'

import { ButtonGroup as BaseButtonGroup } from '../Button/Button'
import { DisconnectButton } from './DisconnectButton'
import { ToggleVideoButton } from '../Me/ToggleVideoButton'
import { ToggleScreenShareButton } from '../Me/ToggleScreenShareButton'
import { ToggleMic } from '../Me/ToggleMic'
import { FlexBox } from '../Box/Box'

type CompactProps = {
  compact: boolean
}

const ButtonGroup = styled(BaseButtonGroup)<CompactProps>`
  ${({ compact }) =>
    compact &&
    `
    button {
      width: 24px;
      height: 24px;
      min-width: 0;
      min-height: 0;
      font-size: 12px;
      padding: 0;
      
      svg {
        font-size: 12px;
      }
    }
  `}
`

const ControlsWrapper = styled(FlexBox)<CompactProps>`
  width: 100%;
  z-index: 2;

  ${({ compact }) =>
    compact &&
    `
    position: absolute;
    bottom: 0;
    left: 0;
    padding-bottom: 8px;
  `}
`

type Props = {
  compact: boolean
  onChatClick: () => void
  onDisconnect: () => void
}

export const Controls = ({ compact, onDisconnect }: Props) => {
  return (
    <ControlsWrapper className="controls" compact={compact} direction="column">
      <FlexBox flexGrow={2} justifyContent="center">
        <ButtonGroup compact={compact} padding={compact ? 'small' : 'normal'}>
          <ToggleScreenShareButton />
          <ToggleMic />
          <ToggleVideoButton />
          <DisconnectButton onClick={onDisconnect} />
        </ButtonGroup>
      </FlexBox>
    </ControlsWrapper>
  )
}
