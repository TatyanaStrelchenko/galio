import React, { Fragment, useState } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { DateTime } from 'luxon'

import { Message as MessageType, MessageTree } from '../../types/space'
import { User } from '../../types/user'
import { RootState } from '../../types/state'
import {
  repliesByMessageIdSelector,
  showRepliesSelector,
  toggleShowReplies,
} from '../../store/replies/replies'
import { Button } from '../Button/Button'
import { Linkify } from '../Linkify/Linkify'
import { Actions } from './Actions'
import { MessageInput } from './MessageInput'
import { useSpaces } from '../Spaces/SpacesProvider'
import { sendMessage } from '../../services/channels'
import { useUser } from '../User/UserProvider'
import { DateDivider } from './DateDivider'
import { ToggleRepliesButton } from './ToggleRepliesButton'
import { MessageLinks } from './MessageLinks'

type ReplyProps = {
  isReply?: boolean
  hasReplies?: boolean
}

type WrapperProps = ReplyProps & {
  queued?: boolean
}

export const Wrapper = styled.div<WrapperProps>`
  position: relative;
  padding-bottom: 6px;
  
  &.root > .children > & {
    margin-left: 16px;
    padding-left: 24px;
  }

  & & {
    border-left: 1px solid #dfdfde;
    margin-left: 11px;
    padding-left: 18px;
  }
  
  & &:last-child {
    border-left: none;
  }
  
  & &:last-child:before {
    border-left: 1px solid #dfdfde;
    left: 0px;
  }
  
  &.root > .children > &:before {
    top: 0;
    width: 35px;
    height: 12px;
  }
  
  & &:before {
    position: absolute;
    display: inline-block;
    left: -1px;
    width: 15px;
    top: -9px;
    height: 22px;
    content: "";
    border-bottom: 1px solid #dfdfde;
    border-left: 1px solid #dfdfde;
    border-bottom-left-radius: 6px;
  }
  
  ${({ queued }) =>
    queued &&
    `
    opacity: 0.5;
  `}
}
`

const Children = styled.div`
  margin-top: 20px;
`

export const Content = styled.div`
  display: flex;
  position: relative;
  z-index: 1;
`

const getAvatarSize = ({ isReply }: ReplyProps) => {
  return `${isReply ? 24 : 32}px`
}

const AvatarWrapper = styled.div<ReplyProps>`
  width: ${getAvatarSize};
  height: ${getAvatarSize};

  & > img {
    background-color: #c4c4c4;
    border-radius: 50%;
    height: ${getAvatarSize};
  }
`

export const UserName = styled.div<ReplyProps>`
  color: #000000;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  margin-bottom: ${({ isReply }) => (isReply ? 4 : 8)}px;
`

export const Sent = styled.span`
  color: #c4c4c4;
  font-size: 12px;
`

export const MessageOffset = styled.div<ReplyProps>`
  width: ${getAvatarSize};
  min-width: ${getAvatarSize};
`

export const MessageContentWrapper = styled.div<ReplyProps>`
  flex-grow: 1;
  margin-left: 8px;
  font-size: 14px;
  line-height: 21px;
  min-width: 0;
`

export const MessageContent = styled.div`
  &:hover {
    background-color: #f6f6f6;
  }
`

export const MessageContentText = styled.div`
  display: inline;
  margin-right: 16px;
  word-break: break-word;
  color: #333333;
`

type AvatarProps = {
  user: Pick<User, 'picture' | 'name'>
  isReply?: boolean
}

export const Avatar = ({ user, isReply }: AvatarProps) => {
  return (
    <AvatarWrapper isReply={isReply}>
      <img referrerPolicy="no-referrer" src={user.picture} alt={`${user.name} avatar`} />
    </AvatarWrapper>
  )
}

const noop = () => {}

type Props = {
  message: MessageTree
  previousMessage?: MessageTree
  queued?: boolean
  onLoadMoreReplies?: (message: MessageType) => void
  onLoadMoreRootReplies?: (message: MessageTree) => void
}

export const TreeMessage = ({
  message,
  previousMessage,
  queued = false,
  onLoadMoreReplies = noop,
  onLoadMoreRootReplies = noop,
}: Props) => {
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const dispatch = useDispatch()
  const user = message.user
  const showReplies = useSelector((state: RootState) => showRepliesSelector(state, message.id))
  const replies = useSelector((state: RootState) => repliesByMessageIdSelector(state, message.id))
  const { selectedTextChannel } = useSpaces()
  const { user: loggedInUser } = useUser()

  const isArchived = Boolean(selectedTextChannel?.archived)
  const isReply = message.parent_id !== null
  const hasReplies = !queued && Boolean(message.replies_count && message.replies_count > 0)
  const hasMoreRootReplies =
    !queued && Boolean(message.root_replies_count! > message.children.length)
  const createdAt = DateTime.fromISO(message.created_at)
  const daysDifference = previousMessage
    ? createdAt
        .startOf('day')
        .diff(DateTime.fromISO(previousMessage.created_at).startOf('day'), 'days').days
    : 1
  const showDateDivider = daysDifference >= 1 && !isReply

  const showFullMessage =
    showDateDivider ||
    message.user_id !== previousMessage?.user_id ||
    previousMessage.children.length > 0 ||
    (message.user_id === previousMessage?.user_id &&
      message.parent_id === null &&
      message.children.length > 0)

  const wrapperClassName = ['wrapper', !isReply ? 'root' : ''].join(' ')

  const handleLoadMoreClick = () => {
    if (replies.length) {
      dispatch(toggleShowReplies(message))
    } else {
      onLoadMoreReplies(message)
    }
  }

  const handleLoadMoreRootRepliesClick = () => {
    onLoadMoreRootReplies(message)
  }

  const handleMessageContentEnter = () => {
    setShowActions(true)
  }

  const handleMessageContentLeave = () => {
    setShowActions(false)
  }

  const handleReplyToggle = () => {
    setShowReplyInput(!showReplyInput)
  }

  const handleReplySend = (content: string) => {
    const reply: MessageType = {
      id: null,
      content,
      depth: 0,
      parent_id: message.id!,
      channel_id: selectedTextChannel?.id!,
      user_id: loggedInUser?.id || 0,
      user: loggedInUser,
      created_at: new Date().toISOString(),
      attachments: [],
    }

    sendMessage(selectedTextChannel!, reply)
    setShowReplyInput(false)
  }

  return (
    <Fragment>
      {showDateDivider && <DateDivider date={createdAt} />}
      <Wrapper
        className={wrapperClassName}
        isReply={isReply}
        hasReplies={hasReplies}
        queued={queued}
      >
        <Content className="content">
          <MessageOffset isReply={isReply}>
            {showFullMessage && <Avatar user={user} isReply={isReply} />}
          </MessageOffset>
          <MessageContentWrapper isReply={isReply}>
            {showFullMessage && (
              <UserName isReply={isReply}>
                {user.name} <Sent>{createdAt.toFormat('HH:mm')}</Sent>
              </UserName>
            )}
            <MessageContent
              onMouseEnter={handleMessageContentEnter}
              onMouseLeave={handleMessageContentLeave}
            >
              <MessageContentText>
                <Linkify>{message.content}</Linkify>
              </MessageContentText>
              <Actions visible={showActions} onReply={handleReplyToggle} />
              {isArchived && showReplyInput && <MessageInput onMessageSend={handleReplySend} />}
            </MessageContent>
            {hasReplies && (
              <div>
                {/* todo: :before border on the button */}
                <ToggleRepliesButton
                  showReplies={showReplies}
                  message={message}
                  onClick={handleLoadMoreClick}
                />
              </div>
            )}
            <MessageLinks variant="normal" messageLinks={message.attachments} />
          </MessageContentWrapper>
        </Content>
        {message.children.length > 0 && (
          <Children className="children">
            {message.children.map((childMessage, index) => (
              <TreeMessage
                key={childMessage.id}
                message={childMessage}
                previousMessage={message.children[index - 1]}
                onLoadMoreReplies={onLoadMoreReplies}
              />
            ))}
          </Children>
        )}
        {hasMoreRootReplies && (
          <Button size="small" variant="link" onClick={handleLoadMoreRootRepliesClick}>
            Load More Replies
          </Button>
        )}
      </Wrapper>
    </Fragment>
  )
}
