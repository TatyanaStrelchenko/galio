import React from 'react'

import { Button } from '../Button/Button'
import { PhoneCross } from '../Icons/PhoneCross'
import styled from 'styled-components'

const ButtonDisconnect = styled(Button)`
  &:hover {
    background: #ac362f;
  }
`

type Props = {
  onClick: () => void
}

export const DisconnectButton = ({ onClick }: Props) => {
  return (
    <ButtonDisconnect
      circle
      size="large"
      variant="danger"
      onClick={onClick}
      title="Finish video call"
    >
      <PhoneCross />
    </ButtonDisconnect>
  )
}
