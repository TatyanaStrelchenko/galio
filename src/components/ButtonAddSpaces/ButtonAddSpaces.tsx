import React from 'react'
import styled from 'styled-components'
import { AddIcon } from '../Icons/AddIcon'
import { Space } from '../Spaces/Spaces'

const ButtonAddSpace = styled(Space)`
  background: #97c2ba;
  color: white;
  border: none;
`
export const ButtonAddSpaces = () => {
  return (
    <ButtonAddSpace>
      <AddIcon />
    </ButtonAddSpace>
  )
}
