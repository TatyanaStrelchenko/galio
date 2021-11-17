import React, { createContext, useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { TextChannel, createTextChannel } from '../../services/TextChannel'
import { Message } from '../../types/space'
import { newChatMessage } from '../../store/textChannels/textChannels'
import { ChannelInfo } from '../../types/textChannel'
import { updateChannelsInfoAction } from '../../store/mediaChannels/byId'

const TextChannelContext = createContext<TextChannel | null>(null)

export const useTextChannel = () => {
  return useContext(TextChannelContext)
}

type Props = {
  children: React.ReactNode
}

export const TextChannelProvider = ({ children }: Props) => {
  const [textChannel, setTextChannel] = useState<TextChannel | null>()
  const dispatch = useDispatch()

  useEffect(() => {
    setTextChannel(createTextChannel())

    return () => {
      setTextChannel(null)
    }
  }, [])

  useEffect(() => {
    const eventEmitter = textChannel?.eventEmitter

    const handleChatMessage = (message: Message) => dispatch(newChatMessage(message))

    eventEmitter?.on('chat:message', handleChatMessage)

    return () => {
      eventEmitter?.off('chat:message', handleChatMessage)
    }
  }, [dispatch, textChannel?.eventEmitter])

  useEffect(() => {
    const eventEmitter = textChannel?.eventEmitter

    const handleChannelsInfo = (channelsInfo: ChannelInfo[]) => {
      dispatch(updateChannelsInfoAction(channelsInfo))
    }

    eventEmitter?.on('channels:info', handleChannelsInfo)

    return () => {
      eventEmitter?.off('channels:info', handleChannelsInfo)
    }
  }, [dispatch, textChannel?.eventEmitter])

  if (!textChannel) {
    return null
  }

  return <TextChannelContext.Provider value={textChannel}>{children}</TextChannelContext.Provider>
}
