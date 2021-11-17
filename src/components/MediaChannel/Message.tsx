import React, { useState } from 'react'
import { DateTime } from 'luxon'
import { useSelector } from 'react-redux'

import { Message as MessageType, VideoChatMessageMeta } from '../../types/space'
import { RootState } from '../../types/state'
import { userByIdSelector } from '../../store/users'
import {
  Content,
  Wrapper,
  MessageOffset,
  Avatar,
  MessageContentWrapper,
  Sent,
  UserName,
  MessageContent,
  MessageContentText,
} from '../TextChannel/TreeMessage'
import { Actions } from '../TextChannel/Actions'
import { MessageLinks } from '../TextChannel/MessageLinks'
import { MessageArchiver } from './MessageArchiver'

type Props = {
  message: MessageType
  previousMessage?: MessageType
  meta?: VideoChatMessageMeta
  onSave?: (message: MessageType) => void
}

export const Message = ({ message, previousMessage, meta, onSave }: Props) => {
  const user = useSelector((state: RootState) => userByIdSelector(state, message.user_id))
  const [showActions, setShowActions] = useState(false)

  const createdAt = DateTime.fromISO(message.created_at)
  const daysDifference = previousMessage
    ? createdAt
        .startOf('day')
        .diff(DateTime.fromISO(previousMessage.created_at).startOf('day'), 'days').days
    : 1
  const showDateDivider = daysDifference >= 1
  const showFullMessage =
    showDateDivider ||
    message.user_id !== previousMessage?.user_id ||
    (message.user_id === previousMessage?.user_id && message.parent_id === null)

  const handleMessageContentEnter = () => {
    setShowActions(true)
  }

  const handleMessageContentLeave = () => {
    setShowActions(false)
  }

  const handleSave = () => {
    onSave?.(message)
  }

  return (
    <Wrapper>
      <Content className="content">
        <MessageOffset>{showFullMessage && <Avatar user={user} />}</MessageOffset>
        <MessageContentWrapper>
          {showFullMessage && (
            <UserName>
              {user.name} <Sent>{createdAt.toFormat('HH:mm')}</Sent>
            </UserName>
          )}
          <MessageContent
            onMouseEnter={handleMessageContentEnter}
            onMouseLeave={handleMessageContentLeave}
          >
            <MessageContentText>{message.content}</MessageContentText>
            {meta?.attachments && <MessageLinks messageLinks={meta.attachments} />}
            <Actions visible={showActions} isSaved={message.isSaved} onSave={handleSave} />
          </MessageContent>
          <MessageArchiver message={message} />
        </MessageContentWrapper>
      </Content>
    </Wrapper>
  )
}
