import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { getColor } from '../../theme/utils'
import { ChevronUpIcon } from '../Icons/ChevronUpIcon'

type Props = {
  title: React.ReactNode
  children: React.ReactNode
  onOpenChange: (isOpen: boolean) => void
  className?: string
  initialIsOpen?: boolean
}

type AccordionItemProps = {
  collapsed: boolean
}

const AccordionItem = styled.div<AccordionItemProps>`
  height: auto;
  max-height: 9999px;
  // transition: max-height 0.3s cubic-bezier(1, 0, 1, 0);
  overflow: hidden;
  position: relative;

  ${({ collapsed }) =>
    collapsed &&
    `
    max-height: 0;
    // transition: max-height 0.35s cubic-bezier(0, 1, 0, 1);
  `}
`

type AccordionTitleProps = {
  open: boolean
}

const AccordionTitle = styled.div<AccordionTitleProps>`
  display: flex;
  align-items: center;
  padding: 8px 11px;
  position: relative;
  font-weight: 600;
  cursor: pointer;
  margin-top: 9px;
  color: #6c6e6e;

  &:hover {
    .button-add {
      visibility: visible;
    }
  }

  ${({ open }) =>
    open &&
    `
    .icon {
        transform: rotate(0deg);
      }
  `};
`
const IconWrapper = styled.div`
  height: 16px;
  transform: rotate(-90deg);
  transition: transform 0.15s;
  color: ${getColor('textAlt')};
  margin-right: 10px;
`

export const Accordion = ({
  initialIsOpen = false,
  title,
  children,
  className,
  onOpenChange,
}: Props) => {
  const [isOpen, setOpen] = useState(initialIsOpen)
  const isCollapsed = !isOpen

  useEffect(() => {
    if (initialIsOpen) {
      setOpen(initialIsOpen)
    }
  }, [initialIsOpen])

  const handleAccordionTitleClick = () => {
    const nextIsOpen = !isOpen

    setOpen(nextIsOpen)
    onOpenChange(nextIsOpen)
  }

  return (
    <>
      <AccordionTitle className={className} open={isOpen} onClick={handleAccordionTitleClick}>
        <IconWrapper className="icon">
          <ChevronUpIcon />
        </IconWrapper>
        {title}
      </AccordionTitle>
      <AccordionItem collapsed={isCollapsed}>{children}</AccordionItem>
    </>
  )
}
