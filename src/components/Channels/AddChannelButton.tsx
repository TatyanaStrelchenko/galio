import React from 'react'
import styled from 'styled-components'

type Props = {
  children: React.ReactNode
  className?: string
  onAddClick?: () => void
}

export const ButtonAdd = styled.div`
  cursor: pointer;
`

export const AddChannelButton = ({ children, className, onAddClick }: Props) => {
  return (
    <ButtonAdd onClick={onAddClick} className={className}>
      {children}
    </ButtonAdd>
  )
}
