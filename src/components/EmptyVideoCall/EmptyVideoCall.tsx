import React from 'react'
import styled from 'styled-components'
import { Button } from '../Button/Button'
import { ReactComponent as EmptyVideoCallSvg } from '../../images/emptyVideoCall.svg'

export const EmptyBlock = styled.div`
  text-align: center;
  padding: 22px 0 0;
`

export const TextInfo = styled.p`
  font-size: 14px;
  margin: 25px 0;
  font-weight: 500;
`

export const ButtonFullWidth = styled(Button)`
  font-size: 14px;
  line-height: 21px;
  width: 100%;
  color: white;
`

export const EmptyVideoCall = () => {
  return (
    <EmptyBlock>
      <EmptyVideoCallSvg />
      <TextInfo>Create your first Video Call</TextInfo>
    </EmptyBlock>
  )
}
