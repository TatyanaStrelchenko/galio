import React, { createContext, useContext, useState } from 'react'
import { types } from 'mediasoup-client'

type Producers = {
  audioProducer: types.Producer | null
  videoProducer: types.Producer | null
  setAudioProducer: (producer: types.Producer | null) => void
  setVideoProducer: (producer: types.Producer | null) => void
}

const MyProducersContext = createContext<Producers>({
  audioProducer: null,
  videoProducer: null,
  setAudioProducer: () => {},
  setVideoProducer: () => {},
})

export const useMyProducers = () => {
  const myProducers = useContext(MyProducersContext)

  return myProducers
}

type Props = {
  children: React.ReactNode
}

export const MyProducersProvider = ({ children }: Props) => {
  const [audioProducer, setAudioProducer] = useState<types.Producer | null>(null)
  const [videoProducer, setVideoProducer] = useState<types.Producer | null>(null)

  const contextValue = {
    audioProducer,
    videoProducer,
    setAudioProducer,
    setVideoProducer,
  }

  return <MyProducersContext.Provider value={contextValue}>{children}</MyProducersContext.Provider>
}
