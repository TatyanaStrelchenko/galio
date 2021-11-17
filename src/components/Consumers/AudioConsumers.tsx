import React from 'react'

import { useConsumersMedia } from './ConsumersProvider'
import { Media } from '../Media/Media'

export const AudioConsumers = () => {
  const audioConsumers = useConsumersMedia('audio')

  return (
    <>
      {/* @ts-ignore */}
      {audioConsumers.map((consumer) => (
        <Media
          key={consumer.consumerId}
          id={consumer.consumerId}
          kind="audio"
          stream={consumer.stream}
        />
      ))}
    </>
  )
}
