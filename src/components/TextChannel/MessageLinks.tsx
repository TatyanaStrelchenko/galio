import React from 'react'
import styled from 'styled-components'

import { MessageAttachment } from '../../types/space'
import { LinkPreview, VariantProps } from './LinkPreview'

const MessageLinksWrapper = styled.div`
  div + div {
    margin-top: 4px;
  }
`

type Props = VariantProps & {
  messageLinks: MessageAttachment[]
  className?: string
}

export const MessageLinks = ({ messageLinks, className = '', ...props }: Props) => {
  if (!messageLinks.length) {
    return null
  }

  return (
    <MessageLinksWrapper className={`links-wrapper ${className}`}>
      {messageLinks.map((link, index) => (
        <LinkPreview key={index} link={link} {...props} />
      ))}
    </MessageLinksWrapper>
  )
}
