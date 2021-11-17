import React from 'react'
import styled from 'styled-components'

type Props = {
  kind: 'audio' | 'video'
  stream?: MediaStream | null
  id?: string
  className?: string
}

export const Media = ({ stream, kind, id, className }: Props) => {
  const setMediaRef = (element: HTMLVideoElement | HTMLAudioElement | null) => {
    if (!element || !stream) {
      return
    }

    if (!element.srcObject) {
      element.srcObject = stream
    }

    // @ts-ignore
    element.playsInline = false
    element.autoplay = true
  }

  if (!stream) {
    return null
  }

  const MediaComponent = kind

  return <MediaComponent id={id} className={className} ref={setMediaRef} autoPlay />
}

export const Video = styled(Media)<Props>`
  width: 100%;
  height: 100%;
  object-fit: cover;
`
