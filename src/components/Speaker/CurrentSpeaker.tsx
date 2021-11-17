import React from 'react'
import { useSelector } from 'react-redux'

import { userByIdSelector } from '../../store/users'
import { CurrentSpeaker as CurrentSpeakerType, useCurrentSpeaker } from './CurrentSpeakerProvider'
import { SpeakerMedia } from './SpeakerMedia'
import { MyMedia } from '../Me/MyMedia'
import { RootState } from '../../types/state'
import { useUserConsumer } from '../Consumers/ConsumersProvider'
import { useUser } from '../User/UserProvider'

type ClassNameProps = {
  className?: string
}

type CurrentSpeakerMediaProps = ClassNameProps & {
  currentSpeaker: CurrentSpeakerType
}

const CurrentSpeakerMedia = ({ className, currentSpeaker }: CurrentSpeakerMediaProps) => {
  const user = useSelector((state: RootState) => userByIdSelector(state, currentSpeaker.userId))
  const userConsumer = useUserConsumer(currentSpeaker.userId, 'video')

  return <SpeakerMedia className={className} user={user} mediaStream={userConsumer?.stream} />
}

export const CurrentSpeaker = ({ className }: ClassNameProps) => {
  const { user } = useUser()
  const currentSpeaker = useCurrentSpeaker()

  if (currentSpeaker && currentSpeaker.userId !== user?.id) {
    return <CurrentSpeakerMedia className={className} currentSpeaker={currentSpeaker} />
  }

  return <MyMedia className={className} />
}
