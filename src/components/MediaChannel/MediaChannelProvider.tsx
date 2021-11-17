import React, { createContext, useContext, useEffect, useState } from 'react'
import { MediaChannel, createMediaChannel } from '../../services/MediaChannel'

export const MediaChannelContext = createContext<MediaChannel | null>(null)
const MediaChannelErrorsContext = createContext<Error[]>([])

export const useMediaChannel = () => {
  const mediaChannel = useContext(MediaChannelContext)

  if (!mediaChannel) {
    throw new Error('Should be wrapped in MediaChannelProvider')
  }

  return mediaChannel
}

export const useMediaChannelErrors = () => {
  const errors = useContext(MediaChannelErrorsContext)

  return errors
}

type Props = {
  channelId: number | string
  children: React.ReactNode
}

export const MediaChannelProvider = ({ channelId, children }: Props) => {
  const [errors, setErrors] = useState<Error[]>([])
  const [mediaChannel, setMediaChannel] = useState<MediaChannel | null>(null)

  useEffect(() => {
    return () => {
      setMediaChannel(null)
    }
  }, [])

  useEffect(() => {
    const nextMediaChannel = createMediaChannel(channelId)

    setMediaChannel(nextMediaChannel)

    return () => {
      nextMediaChannel.disconnect()
    }
  }, [channelId])

  useEffect(() => {
    const handleSocketConnectError = (error: Error) => {
      setErrors((prevErrors) => [...prevErrors, error])
    }

    mediaChannel?.eventEmitter.on('socket:error', handleSocketConnectError)

    return () => {
      mediaChannel?.eventEmitter.off('socket:error', handleSocketConnectError)
    }
  }, [mediaChannel])

  useEffect(() => {
    const handleBeforeUnload = () => {
      mediaChannel?.disconnect()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [mediaChannel])

  if (!mediaChannel) {
    return null
  }

  return (
    <MediaChannelContext.Provider value={mediaChannel}>
      <MediaChannelErrorsContext.Provider value={errors}>
        {children}
      </MediaChannelErrorsContext.Provider>
    </MediaChannelContext.Provider>
  )
}
