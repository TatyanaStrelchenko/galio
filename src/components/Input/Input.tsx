import React from 'react'
import styled from 'styled-components'

import { Variant } from '../../types/style'
import { Text } from '../Typography/Text'

const Label = styled(Text).attrs(() => ({ as: 'label' }))<
  React.LabelHTMLAttributes<HTMLLabelElement>
>`
  display: inline-block;
  margin-bottom: 5px;
  color: #b9b9b9;
  font-size: 14px;
  line-height: 21px;
  text-transform: capitalize;
`

const StyledInput = styled.input<React.InputHTMLAttributes<HTMLInputElement>>`
  display: block;
  width: 100%;
  height: 40px;
  padding: 0.375rem 0.75rem;
  font-size: 14px;
  line-height: 21px;
  font-weight: 400;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ebebeb;
  border-radius: 0.25rem;
  box-sizing: border-box;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    color: #495057;
    background-color: #fff;
    outline: 0;
  }

  &::placeholder {
    color: #000;
    font-size: 14px;
    line-height: 21px;
  }

  ${({ type }) =>
    type === 'range' &&
    `
    margin: 0;
    padding: 0;
  `}
`

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  message?: string
  messageVariant?: Variant
  inputRef?: React.Ref<HTMLInputElement>
}

export const Input = ({
  id,
  label,
  message,
  messageVariant = 'secondary',
  inputRef,
  ...props
}: Props) => {
  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <StyledInput ref={inputRef} {...props} />
      {message && <Text variant={messageVariant}>{message}</Text>}
    </div>
  )
}
