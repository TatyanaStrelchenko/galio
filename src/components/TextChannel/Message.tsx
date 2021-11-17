import React, { Fragment } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'

import { Message as MessageType } from '../../types/space'
import { User } from '../../types/user'
import { RootState } from '../../types/state'
import { userByIdSelector } from '../../store/users'
import {
  repliesByMessageIdSelector,
  showRepliesSelector,
  toggleShowReplies,
} from '../../store/replies/replies'
import { Button } from '../Button/Button'

const DEPTH_OFFSET_MARGIN = 60

const getDepthOffset = (depth: number) => {
  return depth * DEPTH_OFFSET_MARGIN
}

const noop = () => {}

type QueuedMessageProps = {
  queued?: boolean
  depth?: number
}

type ReplyProps = {
  isReply: boolean
}

const MessageWrapper = styled.div<QueuedMessageProps>`
  display: flex;

  ${({ queued }) =>
    queued &&
    `
    opacity: 0.5;
  `}

  ${({ depth }) =>
    depth &&
    `
    margin-left: ${getDepthOffset(depth)}px;
  `}

  & + & {
    padding-top: 16px;
  }
`

const AvatarWrapper = styled.div<ReplyProps>`
  width: ${({ isReply }) => (isReply ? 24 : 44)}px;
  height: ${({ isReply }) => (isReply ? 24 : 44)}px;

  & > img {
    height: ${({ isReply }) => (isReply ? 24 : 44)}px;
  }
`

const AvatarImage = styled.img`
  background-color: #c4c4c4;
  border-radius: 50%;
`

const MessageContent = styled.div<ReplyProps>`
  margin-left: ${({ isReply }) => (isReply ? 8 : 16)}px;
`

const UserName = styled.div`
  font-weight: 500;
  color: #000000;
  margin-bottom: 8px;
`

const Sent = styled.span`
  color: #c4c4c4;
`

const MessageOffset = styled.div<ReplyProps>`
  width: ${({ isReply }) => (isReply ? 24 : 44)}px;
`

type AvatarProps = {
  user: User
  isReply: boolean
}

const Avatar = ({ user, isReply }: AvatarProps) => {
  return (
    <AvatarWrapper isReply={isReply}>
      <AvatarImage src={user.picture} alt={`${user.name} Avatar`} />
    </AvatarWrapper>
  )
}

type Props = {
  message: MessageType
  children?: React.ReactNode
  queued?: boolean
  previousMessage?: MessageType
  shouldShowFullMessage?: boolean
  onLoadMoreReplies?: (message: MessageType) => void
}

// todo: replace by tree message
export const Message = ({
  message,
  previousMessage,
  children,
  queued = false,
  shouldShowFullMessage = false,
  onLoadMoreReplies = noop,
}: Props) => {
  const user = useSelector((state: RootState) => userByIdSelector(state, message.user_id))

  const isReply = message.depth > 0
  const showFullMessage =
    shouldShowFullMessage || isReply || message.user_id !== previousMessage?.user_id

  return (
    <MessageWrapper className="message-wrapper" queued={queued} depth={message.depth}>
      <MessageOffset isReply={isReply}>
        {showFullMessage && <Avatar user={user} isReply={isReply} />}
      </MessageOffset>
      <MessageContent isReply={isReply}>
        {showFullMessage && (
          <UserName>
            {user.name} <Sent>{message.created_at}</Sent>
          </UserName>
        )}
        {message.content}
        {children}
      </MessageContent>
    </MessageWrapper>
  )
}

export const MessageWithReplies = ({
  message,
  previousMessage,
  queued = false,
  onLoadMoreReplies = noop,
}: Props) => {
  const dispatch = useDispatch()
  const replies = useSelector((state: RootState) => repliesByMessageIdSelector(state, message.id))
  const showReplies = useSelector((state: RootState) => showRepliesSelector(state, message.id))

  const shouldShowFullMessage = message.depth === 0 && previousMessage?.depth !== 0

  const handleLoadMoreClick = () => {
    if (replies.length) {
      dispatch(toggleShowReplies(message))
    } else {
      onLoadMoreReplies(message)
    }
  }

  return (
    <Fragment>
      <Message
        message={message}
        previousMessage={previousMessage}
        queued={queued}
        shouldShowFullMessage={shouldShowFullMessage}
      >
        {Boolean(message.replies_count && message.replies_count > 0) && (
          <div>
            <Button onClick={handleLoadMoreClick} size="small" variant="link">
              {showReplies ? 'Hide' : 'Show'} {message.replies_count} Replies
            </Button>
          </div>
        )}
      </Message>
      {showReplies &&
        replies.map((reply, index) => (
          <Message key={reply.id} message={reply} previousMessage={replies[index - 1]} />
        ))}
    </Fragment>
  )
}
