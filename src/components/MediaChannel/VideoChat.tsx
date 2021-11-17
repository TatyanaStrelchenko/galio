import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { Message, VideoChatMessageMeta } from '../../types/space'
import { findLinks } from '../../services/channels'
import { MessageInput } from '../TextChannel/MessageInput'
import { MessagesContent as BaseMessagesContent } from '../TextChannel/TextChannel'
import { Messages } from './Messages'
import { useMediaChannel } from './MediaChannelProvider'
import { MessageArchiverProvider, useMessageArchiver } from './MessageArchiverProvider'

const Container = styled.div`
  position: absolute;
  height: calc(100vh - 65px);
  width: 316px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  z-index: 3;
  border-radius: 8px;
  padding-top: 8px;
  font-size: 14px;
`

const PaddedWrapper = styled.div`
  padding: 0 8px;
`

const MessagesContent = styled(BaseMessagesContent)`
  display: flex;
  flex-direction: column-reverse;
`
type Props = {
  show: boolean
}

const VideoChatView = ({ show }: Props) => {
  const mediaChannel = useMediaChannel()
  const { setIsMessageArchivable } = useMessageArchiver()
  const [messages, setMessages] = useState<Message[]>([])
  const [messagesMeta, setMessagesMeta] = useState<Record<string, VideoChatMessageMeta>>({})

  useEffect(() => {
    const handleVideoChatMessage = (message: Message) => {
      const links = findLinks(message.content)

      if (links.length > 0) {
        setIsMessageArchivable(message.id, { isArchivable: true })
      }

      setMessages((prevMessages) => [...prevMessages, message])
    }

    mediaChannel.eventEmitter.on('video:chat:message', handleVideoChatMessage)

    return () => {
      mediaChannel.eventEmitter.off('video:chat:message', handleVideoChatMessage)
    }
  }, [mediaChannel])

  useEffect(() => {
    const handleVideoChatMessageMeta = (messageMeta: VideoChatMessageMeta) => {
      setMessagesMeta((prevMessagesMeta) => ({
        ...prevMessagesMeta,
        [messageMeta.messageId]: messageMeta,
      }))
    }

    mediaChannel.eventEmitter.on('video:chat:message:meta', handleVideoChatMessageMeta)

    return () => {
      mediaChannel.eventEmitter.off('video:chat:message:meta', handleVideoChatMessageMeta)
    }
  }, [mediaChannel])

  const handleMessageSend = (content: string) => {
    mediaChannel.emitVideoChatMessage(content)
  }

  const handleSave = async (message: Message) => {
    try {
      await mediaChannel.storeChatMessage(message)

      setMessages((prevMessages) => {
        const nextMessages = [...prevMessages]
        const messageIndex = nextMessages.findIndex(({ id }) => id === message.id)

        if (messageIndex >= 0) {
          nextMessages[messageIndex].isSaved = true
        }

        return nextMessages
      })
    } catch (e) {
      console.log('Failed to save message', e)
    }
  }

  if (!show) {
    return null
  }

  return (
    <Container>
      <MessagesContent>
        <PaddedWrapper>
          <Messages messages={messages} messagesMeta={messagesMeta} onSave={handleSave} />
        </PaddedWrapper>
      </MessagesContent>
      <PaddedWrapper>
        <MessageInput onMessageSend={handleMessageSend} />
      </PaddedWrapper>
    </Container>
  )
}

export const VideoChat = (props: Props) => {
  return (
    <MessageArchiverProvider>
      <VideoChatView {...props} />
    </MessageArchiverProvider>
  )
}
