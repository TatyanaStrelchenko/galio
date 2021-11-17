import React from 'react'
import styled from 'styled-components'

import { useMediaChannelErrors } from './MediaChannelProvider'
import { getColor } from '../../theme/utils'

const ErrorsWrapper = styled.div`
  position: absolute;
`

const Error = styled.div`
  padding: 8px 16px;
  margin: 0 8px;
  background-color: ${getColor('danger')};
  border-radius: 4px;
  color: #ffffff;

  & + & {
    margin-top: 8px;
  }
`

export const MediaChannelErrors = () => {
  const mediaChannelErrors = useMediaChannelErrors()

  if (mediaChannelErrors.length === 0) {
    return null
  }

  return (
    <ErrorsWrapper>
      {mediaChannelErrors.map((error, index) => (
        <Error key={index}>{error.message ?? error}</Error>
      ))}
      {mediaChannelErrors.map((error, index) => (
        <Error key={index}>{error.message ?? error}</Error>
      ))}
    </ErrorsWrapper>
  )
}
