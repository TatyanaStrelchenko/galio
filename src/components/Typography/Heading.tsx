import styled from 'styled-components'

import { getColor } from '../../theme/utils'

type As = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as: As
}

const mapHeadingTypeToFontSize: Record<As, string> = {
  h1: '2.5rem',
  h2: '2rem',
  h3: '1.75rem',
  h4: '1.5rem',
  h5: '1.25rem',
  h6: '1rem',
}

export const Heading = styled.h6<HeadingProps>`
  margin-bottom: 0.5rem;
  font-family: inherit;
  font-weight: 500;
  font-size: ${({ as }) => mapHeadingTypeToFontSize[as]};
  line-height: 1.2;
  color: ${getColor('text')};
`
