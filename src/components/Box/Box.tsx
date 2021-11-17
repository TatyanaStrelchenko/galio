import styled, { css } from 'styled-components'

type BoxProps = {
  textAlign?: 'left' | 'right' | 'center'
  width?: string
  height?: string
  flexGrow?: number
  flexBasis?: string
  position?: 'relative'
}

const flexGrowMixin = css<BoxProps>`
  ${({ flexGrow }) =>
    flexGrow &&
    `
    flex-grow: ${flexGrow};
  `}
`

const flexBasisMixin = css<BoxProps>`
  ${({ flexBasis }) =>
    flexBasis &&
    `
    flex-basis: ${flexBasis};
  `}
`

export const Box = styled.div<BoxProps>`
  ${({ textAlign }) =>
    textAlign &&
    `
    text-align: ${textAlign};
  `}

  ${({ width }) =>
    width &&
    `
    width: ${width};
  `}
  
  ${({ height }) =>
    height &&
    `
    height: ${height};
  `}

  ${({ position }) =>
    position &&
    `
    position: ${position};
  `}
  
  ${flexGrowMixin}
  ${flexBasisMixin}
`

type FlexBoxProps = BoxProps & {
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around'
  alignItems?: 'flex-start' | 'flex-end' | 'center'
  direction?: 'row' | 'column'
  grow?: number
  wrap?: 'wrap' | 'wrap-reverse'
}

const justifyContentMixin = css<FlexBoxProps>`
  ${({ justifyContent }) =>
    justifyContent &&
    `
    justify-content: ${justifyContent};
  `}
`

const alignItemsMixin = css<FlexBoxProps>`
  ${({ alignItems }) =>
    alignItems &&
    `
    align-items: ${alignItems};
  `}
`

const directionMixin = css<FlexBoxProps>`
  ${({ direction }) =>
    direction &&
    `
    flex-direction: ${direction};
  `}
`

const wrapMixin = css<FlexBoxProps>`
  ${({ wrap }) =>
    wrap &&
    `
    flex-wrap: ${wrap};
  `}
`

export const FlexBox = styled(Box)<FlexBoxProps>`
  display: flex;

  ${justifyContentMixin}
  ${alignItemsMixin}
  ${directionMixin}
  ${wrapMixin}
`
