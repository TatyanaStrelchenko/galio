import React from 'react'
import styled from 'styled-components'

import { useSpaces } from '../components/Spaces/SpacesProvider'
import { Spaces } from '../components/Spaces/Spaces'
import { ButtonAddSpaces } from '../components/ButtonAddSpaces/ButtonAddSpaces'
import { SpacesWrapper } from '../components/SpacesWrapper/SpacesWrapper'

const Content = styled.div`
  width: 48px;
  min-width: 48px;
  height: 100vh;
  background-color: #308575;
  padding: 62px 0;
`

export const SpacesScene = () => {
  const { selectedVideoChannel, spaces } = useSpaces()

  if (selectedVideoChannel) {
    return null
  }

  return (
    <Content>
      <SpacesWrapper>
        <Spaces spaces={spaces} />
      </SpacesWrapper>
      <SpacesWrapper>
        <ButtonAddSpaces />
      </SpacesWrapper>
    </Content>
  )
}
