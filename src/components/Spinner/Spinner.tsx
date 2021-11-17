import React from 'react'
import styled, { keyframes } from 'styled-components'

import { TextAlign } from '../../types/style'
import { textAlignMixin } from '../Typography/Text'

type Props = {
  size?: 'small'
  align?: TextAlign
}

const spinnerBorder = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const SpinnerBorder = styled.div<Props>`
  display: inline-block;
  width: 2rem;
  height: 2rem;
  vertical-align: text-bottom;
  border: 0.25em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: 0.75s linear infinite ${spinnerBorder};

  ${({ size }) =>
    size === 'small' &&
    `
    width: 1rem;
    height: 1rem;
    border-width: .2em;
  `}
`

const SpinnerWrapper = styled.div<Pick<Props, 'align'>>`
  ${textAlignMixin}
`

export const Spinner = ({ size, align }: Props) => {
  const spinner = <SpinnerBorder size={size} />

  if (align) {
    return <SpinnerWrapper align={align}>{spinner}</SpinnerWrapper>
  }

  return spinner
}
