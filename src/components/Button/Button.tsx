import React from 'react'
import styled from 'styled-components'

import { Variant as BaseVariant, Size } from '../../types/style'
import { createVariant } from '../../theme/utils'
import { Spinner } from '../Spinner/Spinner'

type Variant = BaseVariant | 'ghost'

const background = createVariant('variant', {
  primary: 'background-color: #308575;',
  secondary: 'background-color: rgba(255, 255, 255, 0.4);',
  light: ({ active }) => `
    color: #464646;
    border: 1px solid #cdcdcd;
    background: #ffffff;
    
    ${
      active &&
      `
      background: #eaeaea;
    `
    }
  `,
  danger: `
    color: #ffffff;
    background-color: #dc3545;
  `,
  link: `
    font-weight: 400;
    color: #949494;
    text-decoration: none;
  `,
  ghost: `
    
  `,
  success: `
    color: #ffffff;
    background: #308575;
  `,
})

const hover = createVariant('variant', {
  primary: `
    opacity: .8;
  `,
  secondary: ({ active }: Props) => `
    background-color: #5a6268;
    border-color: #545b62;
    
    ${
      active &&
      `
      background-color: rgba(255,255,255,0.9);
    `
    }
  `,
  light: `
  opacity: .8;
    background-color: #e2e6ea;
    border-color: #dae0e5;
  `,
  danger: `
    background-color: #c82333;
    border-color: #bd2130;
  `,
  link: `
    color: #8C8C8C;
    text-decoration: underline;
  `,
  ghost: `
    
  `,
  success: `
    opacity: .8;
  `,
})

const active = createVariant('variant', {
  primary: `
    background-color: #0062cc;
    border-color: #005cbf;
  `,
  secondary: `

  `,
  light: `
    background-color: #dae0e5;
    border-color: #d3d9df;
  `,
  danger: `
    background-color: #bd2130;
    border-color: #b21f2d;
  `,
  link: `
    color: #8C8C8C;
    text-decoration: underline;
  `,
  ghost: `
    
  `,
  success: `
    opacity: .9;
  `,
})

const focus = createVariant('variant', {
  primary: `
      background-color: #0069d9;
      border-color: #0062cc;
      box-shadow: 0 0 0 0.2rem rgb(38 143 255 / 50%);
    `,
  secondary: ({ active }: Props) => `
      background-color: #5a6268;
      border-color: #545b62;
      box-shadow: 0 0 0 0.2rem rgb(130 138 145 / 50%);
      
      ${
        active &&
        `
        background-color: rgba(255,255,255,0.9);
      `
      }
    `,
  light: `
      background-color: #e2e6ea;
      border-color: #dae0e5;
      box-shadow: 0 0 0 0.2rem rgb(216 217 219 / 50%);
    `,
  danger: `
    background-color: #c82333;
    border-color: #bd2130;
    box-shadow: 0 0 0 0.2rem rgb(225 83 97 / 50%);
  `,
  link: `
    text-decoration: underline;
  `,
  success: ``,
})

const size = createVariant('size', {
  small: ({ variant }: Props) => `
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
    border-radius: 0.2rem;
    
    ${
      variant === 'link' &&
      `
      padding-left: 0;
      padding-right: 0;
      font-size: 12px;
      line-height: 14px;
    `
    }
  `,
  normal: `
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: 0.25rem;
  `,
  large: `
    min-height: 40px;
    min-width: 40px;
    font-size: 16px;
    line-height: 1.5;
    border-radius: 2px;
    
    svg {
      font-size: 16px;
    }
  `,
})

type BaseButtonProps = {
  size: Size
  variant: Variant
  withPadding?: boolean
  circle?: boolean
  active?: boolean
}

const BaseButton = styled.button<BaseButtonProps>`
  display: inline-block;
  color: #ffffff;
  font-family: SF Pro Display;
  font-style: normal;
  font-weight: normal;
  cursor: pointer;
  user-select: none;
  ${size}
  ${({ withPadding }) =>
    !withPadding &&
    `
    padding: 0;
  `}
  ${({ circle }) =>
    circle &&
    `
    border-radius: 50%;
  `}
  
  ${({ active }) =>
    active &&
    `
    background-color: #ffffff;
    color: #464646;
  `}
  
  ${background}

  :hover {
    ${hover}
  }

  :active {
    ${active}
  }

  :focus {
    outline: none;
    ${focus}
  }

  :disabled {
    opacity: 0.65;
    pointer-events: none;
    cursor: auto;
  }
`

type ButtonGroupProps = {
  padding: 'normal' | 'small' | 'large'
}

const groupPadding = createVariant('padding', {
  small: 'margin-left: 8px;',
  normal: 'margin-left: 16px;',
  large: 'margin-left: 24px;',
})

export const ButtonGroup = styled.div.attrs<ButtonGroupProps, ButtonGroupProps>((props) => ({
  padding: props.padding || 'small',
}))`
  ${BaseButton} + ${BaseButton} {
    ${groupPadding}
  }
`

type ButtonContentProps = {
  loading?: boolean
}

// hack for the centering icons
const ButtonContent = styled.div<ButtonContentProps>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '\u200d';
  }

  ${({ loading }) =>
    loading &&
    `
    visibility: hidden;
  `}
`

const SpinnerWrapper = styled.div`
  position: absolute;
  visibility: initial;
  display: flex;
  align-items: center;
`

export type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
  variant?: Variant
  size?: Size
  loading?: boolean
  withPadding?: boolean
  circle?: boolean
  active?: boolean
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'normal',
  loading = false,
  withPadding = true,
  circle = false,
  active = false,
  ...props
}: Props) => {
  return (
    <BaseButton
      variant={variant}
      size={size}
      disabled={loading}
      withPadding={withPadding}
      circle={circle}
      active={active}
      {...props}
    >
      <ButtonContent loading={loading}>
        {loading && (
          <SpinnerWrapper>
            <Spinner size="small" />
          </SpinnerWrapper>
        )}
        {children}
      </ButtonContent>
    </BaseButton>
  )
}
