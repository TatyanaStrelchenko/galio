import React, { Fragment, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'

import { Channel, ChannelType, Message as MessageType } from '../../types/space'
import {
  setMessages as setMessagesAction,
  addQueuedMessage,
  markChannelAsRead as markChannelAsReadAction,
  queuedMessagesSelector,
  removeQueuedMessage,
  newChatMessage,
} from '../../store/textChannels/textChannels'
import { getMessages, sendMessage, markChannelAsRead } from '../../services/channels'
import { useSpaces } from '../Spaces/SpacesProvider'
import { MessageInput } from './MessageInput'
import { Messages } from './Messages'
import { useUser } from '../User/UserProvider'
import { borderedScrollbarMixin } from '../Style/Scrollbar'
import { ChatIcon } from '../Icons/ChatIcon'
import { SavedIcon } from '../Icons/SavedIcon'
import { SvgIconProps } from '../Icons/SvgIcon'
import { ArchiveIcon } from '../Icons/ArchiveIcon'

const Content = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
`

const Header = styled.div`
  display: flex;
  align-items: center;
  min-height: 54px;
  padding: 12px 16px;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
`

type MessagesContentProps = {
  compact?: boolean
}

export const MessagesContent = styled.div<MessagesContentProps>`
  height: 100%;
  overflow-y: scroll;

  ${({ compact }) =>
    !compact &&
    `
    padding: 12px 16px;
  `}

  ${borderedScrollbarMixin}
`

const ChannelTitle = styled.div`
  margin-left: 11px;
  font-weight: 500;
`

const IconWrapper = styled.span`
  display: flex;
  color: #308575;
  font-size: 20px;
`

const channelToIconMap: Record<ChannelType, React.ElementType<SvgIconProps>> = {
  TEXT_CHANNEL: ChatIcon,
  SAVED_MESSAGES_CHANNEL: SavedIcon,
  VIDEO_ARCHIVE_CHANNEL: ArchiveIcon,
  VIDEO_CHANNEL: ArchiveIcon,
}

type ChannelIconProps = {
  channel: Channel
}

const ChannelIcon = ({ channel }: ChannelIconProps) => {
  let Icon = channelToIconMap[channel.type]

  return <Icon fill="#C8DFDB" />
}

const TextChannelView = () => {
  const [loading, setLoading] = useState(true)
  const { selectedTextChannel } = useSpaces()
  const { user } = useUser()
  const dispatch = useDispatch()
  const queuedMessages = useSelector(queuedMessagesSelector)
  const isArchived = selectedTextChannel?.archived ?? false

  useEffect(() => {
    if (!selectedTextChannel) {
      return
    }

    const loadData = async () => {
      const messages = await getMessages(selectedTextChannel)
      await markChannelAsRead(selectedTextChannel)

      dispatch(setMessagesAction(selectedTextChannel, messages))
      dispatch(markChannelAsReadAction(selectedTextChannel))

      setLoading(false)
    }

    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTextChannel?.id, dispatch])

  const handleMessageSend = async (content: string) => {
    if (!selectedTextChannel) {
      return
    }

    const message: MessageType = {
      id: null,
      depth: 0,
      content,
      channel_id: selectedTextChannel.id,
      user_id: user?.id || 0,
      user,
      created_at: new Date().toISOString(),
      attachments: [],
    }

    dispatch(addQueuedMessage(selectedTextChannel, message))

    try {
      const newMessage = await sendMessage(selectedTextChannel, message)

      dispatch(removeQueuedMessage(selectedTextChannel, message))
      dispatch(newChatMessage(newMessage, false))
    } catch (e) {
      console.log('Failed to send message', e)
    }
  }

  return (
    <Content>
      {selectedTextChannel && (
        <Fragment>
          <Header>
            <IconWrapper>
              <ChannelIcon channel={selectedTextChannel} />
            </IconWrapper>
            <ChannelTitle>{selectedTextChannel.name}</ChannelTitle>
          </Header>
          <MessagesContent>
            <Messages
              channel={selectedTextChannel}
              loading={loading}
              queuedMessages={queuedMessages}
            />
          </MessagesContent>
        </Fragment>
      )}
      {!isArchived && <MessageInput onMessageSend={handleMessageSend} />}
    </Content>
  )
}

export const TextChannel = () => {
  return <TextChannelView />
}
