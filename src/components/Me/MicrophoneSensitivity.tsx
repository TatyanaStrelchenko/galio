import React, { useEffect, useRef, useState } from 'react'
import hark, { Harker } from 'hark'
import { useMyProducers } from './MyPrdoducersProvider'

import { Input } from '../Input/Input'
import { Button } from '../Button/Button'
import { useMyMediaStream } from './MyMediaStreamProvier'

const Sensitivity = {
  MIN: -100,
  MAX: 0,
}

export const MicrophoneSensitivity = () => {
  const speechRef = useRef<Harker | null>(null)
  const [threshold, setThreshold] = useState(-50)
  const { audioProducer } = useMyProducers()
  const { audioStream } = useMyMediaStream()

  useEffect(() => {
    const audioCtx = new AudioContext()
    const gainNode = audioCtx.createGain()
    let source: MediaStreamAudioSourceNode | null = null

    if (audioStream && audioProducer) {
      const newAudioStream = audioStream

      speechRef.current = hark(newAudioStream, { interval: 50 })

      source = audioCtx.createMediaStreamSource(newAudioStream)

      source.connect(gainNode)
      gainNode.connect(audioCtx.destination)

      speechRef.current.on('speaking', async () => {
        if (!audioProducer) {
          return
        }

        gainNode.gain.setValueAtTime(1, audioCtx.currentTime)
      })

      speechRef.current.on('stopped_speaking', async () => {
        if (!audioProducer) {
          return
        }

        gainNode.gain.setValueAtTime(0, audioCtx.currentTime)
      })
    }

    return () => {
      speechRef.current?.stop()
      source?.disconnect()
      gainNode.disconnect()
    }
  }, [audioStream, audioProducer])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)

    setThreshold(value)
  }

  const handleApplyClick = () => {
    if (!speechRef.current) {
      return
    }

    speechRef.current.setThreshold(threshold)
  }

  return (
    <div>
      <div>Current sensitivity: {threshold} dB</div>
      <Input
        type="range"
        min={Sensitivity.MIN}
        max={Sensitivity.MAX}
        value={threshold}
        onChange={handleChange}
      />
      <Button onClick={handleApplyClick}>Apply</Button>
    </div>
  )
}
