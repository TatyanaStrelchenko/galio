import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import hark, { Harker } from 'hark'
import { useSelector } from 'react-redux'

import { User } from '../../types/user'
import { RootState } from '../../types/state'
import { useMediaChannel } from '../MediaChannel/MediaChannelProvider'
import { useMyMediaStream } from '../Me/MyMediaStreamProvier'
import { useUser } from '../User/UserProvider'
import { useParticipantIds } from '../MediaChannel/ParticipantsProvider'
import { userByIdSelector } from '../../store/users'

export type CurrentSpeaker = {
  userId: number
}

const CurrentSpeakerContext = createContext<CurrentSpeaker | null>(null)

export const useCurrentSpeaker = (): CurrentSpeaker | null => {
  const { user } = useUser()
  const currentSpeaker = useContext(CurrentSpeakerContext)
  const participantIds = useParticipantIds()

  if (currentSpeaker && currentSpeaker.userId !== user?.id) {
    return currentSpeaker
  }

  if (participantIds.length >= 2) {
    const [userId] = participantIds.filter((participant) => participant !== user?.id)

    return { userId }
  }

  return null
}

export const useCurrentSpeakerUser = (): User | null => {
  const currentSpeaker = useCurrentSpeaker()

  const user = useSelector((state: RootState) => {
    return currentSpeaker ? userByIdSelector(state, currentSpeaker.userId) : null
  })

  return user
}

type Props = {
  children: React.ReactNode
}

export const CurrentSpeakerProvider = ({ children }: Props) => {
  const speechRef = useRef<Harker>()
  const [currentSpeaker, setCurrentSpeaker] = useState<CurrentSpeaker | null>(null)
  const mediaChannel = useMediaChannel()
  const { user } = useUser()
  const { audioStream } = useMyMediaStream()
  const participantIds = useParticipantIds()

  useEffect(() => {
    const handleCurrentSpeakerChange = (userId: number) => {
      if (user?.id === userId && currentSpeaker && participantIds.includes(currentSpeaker.userId)) {
        return
      }

      setCurrentSpeaker({ userId })
    }

    mediaChannel.eventEmitter.on('current:speaker:change', handleCurrentSpeakerChange)

    return () => {
      mediaChannel.eventEmitter.off('current:speaker:change', handleCurrentSpeakerChange)
    }
  }, [mediaChannel, user, currentSpeaker, participantIds])

  useEffect(() => {
    if (!audioStream || currentSpeaker?.userId === user?.id) {
      return
    }

    speechRef.current = hark(audioStream)

    const handleStartSpeaking = () => {
      mediaChannel.emitCurrentSpeakerChange()
    }

    speechRef.current.on('speaking', handleStartSpeaking)

    return () => {
      // @ts-ignore
      speechRef.current?.off('speaking', handleStartSpeaking)
      speechRef.current?.stop()
    }
  }, [audioStream, mediaChannel, currentSpeaker, user])

  useEffect(() => {
    const handleUserExited = (userId: number) => {
      setCurrentSpeaker((prevSpeaker) => {
        return prevSpeaker?.userId === userId ? null : prevSpeaker
      })
    }

    mediaChannel.eventEmitter.on('user:exited', handleUserExited)

    return () => {
      mediaChannel.eventEmitter.off('user:exited', handleUserExited)
    }
  }, [mediaChannel])

  return (
    <CurrentSpeakerContext.Provider value={currentSpeaker}>
      {children}
    </CurrentSpeakerContext.Provider>
  )
}
