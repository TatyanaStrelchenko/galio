import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'

const MediaDevicesContext = createContext<MediaDeviceInfo[]>([])

export const useAudioDevices = () => {
  const mediaDevices = useContext(MediaDevicesContext)
  const audioDevices = useMemo(() => {
    return mediaDevices.filter((value) => value.kind === 'audioinput')
  }, [mediaDevices])

  return audioDevices
}

export const useVideoDevices = () => {
  const mediaDevices = useContext(MediaDevicesContext)
  const videoDevices = useMemo(() => {
    return mediaDevices.filter((value) => value.kind === 'videoinput')
  }, [mediaDevices])

  return videoDevices
}

type Props = {
  children: React.ReactNode
}

export const MediaDevicesProvider = ({ children }: Props) => {
  const [mediaDevices, setMediaDevices] = useState<MediaDeviceInfo[]>([])

  useEffect(() => {
    const enumerateDevices = async () => {
      const mediaDevices = await navigator.mediaDevices.enumerateDevices()

      setMediaDevices(mediaDevices)
    }

    enumerateDevices()
  }, [])

  return (
    <MediaDevicesContext.Provider value={mediaDevices}>{children}</MediaDevicesContext.Provider>
  )
}
