import React, { createContext, useContext, useState, useEffect } from 'react'

import { useMediaChannel } from '../MediaChannel/MediaChannelProvider'

type Kind = 'audio' | 'video'

export type Consumer = {
  kind: Kind
  consumerId: string
  userId: number
  stream: MediaStream
}

const ConsumersContext = createContext<Consumer[]>([])

export const useConsumers = () => {
  return useContext(ConsumersContext)
}

export const useConsumersMedia = (kind: Kind) => {
  const consumers = useConsumers()

  return consumers.filter((consumer) => consumer.kind === kind)
}

export const useUserConsumer = (userId: number | undefined, kind: Kind) => {
  const consumers = useConsumersMedia(kind)

  if (userId === undefined) {
    return undefined
  }

  return consumers.find((consumer) => consumer.userId === userId)
}

type Props = {
  children: React.ReactNode
}

export const ConsumersProvider = ({ children }: Props) => {
  const mediaChannel = useMediaChannel()
  const [consumers, setConsumers] = useState<Consumer[]>([])

  useEffect(() => {
    const handleConsumerNew = (consumer: Consumer) => {
      setConsumers((prevConsumers) => {
        return [...prevConsumers, consumer]
      })
    }

    const handleConsumerRemove = ({ consumerId }: Pick<Consumer, 'consumerId'>) => {
      const consumer = consumers.find((consumer) => consumer.consumerId === consumerId)

      if (!consumer) {
        console.log('consumer is absent')
        return
      }

      const tracks =
        consumer.kind === 'audio'
          ? consumer.stream.getAudioTracks()
          : consumer.stream.getVideoTracks()

      tracks.forEach((track) => {
        console.log('REMOVE TRACKS!!!')
        track.stop()
      })

      console.log('track stopped')

      setConsumers((prevConsumers) => {
        return prevConsumers.filter(
          (prevConsumer) => prevConsumer.consumerId !== consumer.consumerId
        )
      })
    }

    mediaChannel.eventEmitter.on('consumer:new', handleConsumerNew)
    mediaChannel.eventEmitter.on('consumer:remove', handleConsumerRemove)

    return () => {
      mediaChannel.eventEmitter.off('consumer:new', handleConsumerNew)
      mediaChannel.eventEmitter.off('consumer:remove', handleConsumerRemove)
    }
  }, [consumers, mediaChannel.eventEmitter])

  return <ConsumersContext.Provider value={consumers}>{children}</ConsumersContext.Provider>
}
