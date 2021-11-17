import React, { Fragment } from 'react'
import styled from 'styled-components'

import { Message as MessageType, VideoChatMessageMeta } from '../../types/space'
import { Message } from './Message'

const EmptyMessagesWrapper = styled.div`
  margin-bottom: 8px;
`

const getMessageKey = (message: MessageType) => {
  return new Date(message.created_at).getTime()
}

type Props = {
  messages: MessageType[]
  messagesMeta?: Record<string, VideoChatMessageMeta>
  onSave?: (message: MessageType) => void
}

export const Messages = ({ messages, messagesMeta, onSave }: Props) => {
  if (!messages.length) {
    return <EmptyMessagesWrapper>You don't have any messages yet</EmptyMessagesWrapper>
  }

  return (
    <Fragment>
      {messages.map((message, index) => (
        <Message
          key={getMessageKey(message)}
          message={message}
          previousMessage={messages[index - 1]}
          meta={message.id ? messagesMeta?.[message.id] : undefined}
          onSave={onSave}
        />
      ))}
    </Fragment>
  )
}
