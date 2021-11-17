import React, { Dispatch, SetStateAction, createContext, useContext, useState } from 'react'

type MyVideoStream = {
  audioStream: MediaStream | null
  videoStream: MediaStream | null
  screenStream: MediaStream | null
  setAudioStream: Dispatch<SetStateAction<MediaStream | null>>
  setVideoStream: Dispatch<SetStateAction<MediaStream | null>>
  setScreenStream: Dispatch<SetStateAction<MediaStream | null>>
}

const noop = () => {}

const MyMediaStreamContext = createContext<MyVideoStream>({
  audioStream: null,
  videoStream: null,
  screenStream: null,
  setAudioStream: noop,
  setVideoStream: noop,
  setScreenStream: noop,
})

export const useMyMediaStream = () => {
  const myVideoStream = useContext(MyMediaStreamContext)

  return myVideoStream
}

type Props = {
  children: React.ReactNode
}

export const MyMediaStreamProvider = ({ children }: Props) => {
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null)
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null)

  const contextValue = {
    audioStream,
    videoStream,
    screenStream,
    setAudioStream,
    setVideoStream,
    setScreenStream,
  }

  return (
    <MyMediaStreamContext.Provider value={contextValue}>{children}</MyMediaStreamContext.Provider>
  )
}
