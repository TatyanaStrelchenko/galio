import React from 'react'
import styled, { css } from 'styled-components'

import { Variant, TextAlign, Size } from '../../types/style'
import { getColor, createVariant } from '../../theme/utils'

export type Props = React.HTMLAttributes<HTMLParagraphElement> & {
  variant?: Variant
  align?: TextAlign
  bold?: boolean
  size?: Size
  truncate?: boolean
  wordBreak?: 'normal' | 'break-all' | 'break-word'
}

const sizeVariant = createVariant('size', {
  small: `
    font-size: 12px;
    line-height: 18px;
  `,
  normal: `font-size: 14px;`,
  large: `font-size: 18px;`,
  big: `
    font-size: 16px;
    line-height: 24px;
  `,
  huge: `
    font-size: 24px;
    line-height: 32px;
  `,
})

export const textAlignMixin = css<Props>`
  text-align: ${({ align }) => align || 'left'};
`

export const truncateMixin = css`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

export const Text = styled.p<Props>`
  font-size: 1em;
  font-weight: ${({ bold }) => (bold ? '500' : '400')};
  line-height: 1.5;
  color: ${({ variant }) => getColor(variant || 'text')};
  word-break: ${({ wordBreak = 'normal' }) => wordBreak};
  ${textAlignMixin}
  ${sizeVariant}
  ${({ truncate }) => truncate && truncateMixin}
`
