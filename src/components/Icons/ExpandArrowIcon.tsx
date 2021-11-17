import React from 'react'
import styled from 'styled-components'

import { createVariant } from '../../theme/utils'
import { SvgIcon as BaseSvgIcon } from './SvgIcon'

const direction = createVariant('direction', {
  up: 'transform: rotate(180deg);',
})

const SvgIcon = styled(BaseSvgIcon)`
  ${direction}
`

type Props = {
  direction?: 'up' | 'down'
}

export const ExpandArrowIcon = ({ direction }: Props) => {
  return (
    <SvgIcon viewBox="0 0 16 16" fill="none" direction={direction}>
      <path
        d="M4 6L8 10L12 6"
        stroke="#949494"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  )
}
