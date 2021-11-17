import React, { useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import hark, { Harker } from 'hark'

import { FlexBox } from '../Box/Box'
import { MicIcon } from '../Icons/MicIcon'
import { useMyMediaStream } from '../Me/MyMediaStreamProvier'

const LOW_VOICE_THRESHOLD = 10

const barMixin = css`
  border-radius: 2px;
  height: 4px;
`

const Container = styled(FlexBox)`
  background: #ffffff;
  border-radius: 4px;
  width: 100%;
  padding: 4px 6px;
`

const IconWrapper = styled.div`
  margin-right: 6px;
  font-size: 12px;
  line-height: 12px;
`

const VolumeContainer = styled.div`
  background: #f9f9f9;
  width: 100%;
  ${barMixin}
`

const Bar = styled.div`
  background: #308575;
  width: 0;
  transition-duration: 0.25s;
  ${barMixin}
`

export const VolumePreview = () => {
  const { audioStream } = useMyMediaStream()
  const [volume, setVolume] = useState<number>(0)
  const speechRef = useRef<Harker>()

  useEffect(() => {
    if (!audioStream) {
      return
    }

    const handleVolumeChange = (currentVolume: number) => {
      let nextVolume = currentVolume + 100

      if (nextVolume <= LOW_VOICE_THRESHOLD) {
        nextVolume = 0
      }

      setVolume(nextVolume)
    }

    speechRef.current = hark(audioStream, {
      interval: 100,
      play: false,
    })
    speechRef.current.on('volume_change', handleVolumeChange)

    return () => {
      // @ts-ignore
      speechRef.current?.off('volume_change')
      speechRef.current?.stop()

      setVolume(0)
    }
  }, [audioStream])

  return (
    <FlexBox justifyContent="center">
      <Container alignItems="center">
        <IconWrapper>
          <MicIcon />
        </IconWrapper>
        <VolumeContainer>
          <Bar style={{ width: `${volume}%` }} />
        </VolumeContainer>
      </Container>
    </FlexBox>
  )
}
