import React, { createContext, useContext, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Peer } from '../../types/peer'
import { User, ParticipantInfo, Participant } from '../../types/user'
import { RootState } from '../../types/state'
import { useMediaChannel } from './MediaChannelProvider'
import { usersByIdSelector, setUsers } from '../../store/users'
import { useUser } from '../User/UserProvider'

type ParticipantsInfoMap = Record<number, ParticipantInfo>
type ContextValue = {
  loading: boolean
  participants: ParticipantsInfoMap
}

const userToParticipant = (user: User, participantInfo?: ParticipantInfo): Participant => {
  return {
    micEnabled: false,
    cameraEnabled: false,
    userId: user.id,
    ...user,
    ...participantInfo,
  }
}

const ParticipantsContext = createContext<ContextValue>({
  loading: true,
  participants: {},
})

export const useParticipantIds = (): number[] => {
  const { participants } = useContext(ParticipantsContext)

  return Object.keys(participants).map(Number)
}

export const useIsParticipantLoading = (): boolean => {
  return useContext(ParticipantsContext).loading
}

export const useMyUserParticipant = (): Participant => {
  const { user } = useUser()
  const { participants } = useContext(ParticipantsContext)

  return userToParticipant(user, participants[user.id])
}

export const useMyParticipants = (): Participant[] => {
  const { user: loggedInUser } = useUser()
  const userIds = useParticipantIds()
  const { participants } = useContext(ParticipantsContext)
  const users = useSelector((state: RootState) => usersByIdSelector(state, userIds))

  const hasUndefinedUser = users.some((user) => !user)

  if (hasUndefinedUser) {
    debugger
  }

  // Only for testing purpose
  if (localStorage.getItem('testMode')) {
    const mockedParticipantsCount = localStorage.getItem('participants')
    const times = mockedParticipantsCount ? +mockedParticipantsCount : 10

    const nextUsers = users
      .filter((user) => user.id !== loggedInUser?.id)
      .map((user) => userToParticipant(user, participants[user.id]))

    if (nextUsers.length) {
      return Array.from({ length: times }).map(() => nextUsers[0])
    }

    return nextUsers
  }

  return users
    .filter((user) => user.id !== loggedInUser?.id)
    .map((user) => userToParticipant(user, participants[user.id]))
}

type Props = {
  children: React.ReactNode
}

export const ParticipantsProvider = ({ children }: Props) => {
  const dispatch = useDispatch()
  const [loading, setIsLoading] = useState<boolean>(true)
  const [participants, setParticipants] = useState<ParticipantsInfoMap>({})
  const mediaChannel = useMediaChannel()

  useEffect(() => {
    const handleNewProducers = (peers: Peer[]) => {
      setIsLoading(false)
      setParticipants((prevParticipants) => {
        const nextParticipants = { ...prevParticipants }

        peers.forEach((peer) => {
          nextParticipants[peer.userId] = nextParticipants[peer.userId] ?? {
            userId: peer.userId,
            micEnabled: !peer.muted,
            cameraEnabled: false,
          }
          const participant = nextParticipants[peer.userId]

          peer.producers?.forEach((producer) => {
            if (producer.kind === 'audio') {
              participant.micEnabled = peer.muted ? !peer.muted : true
            } else if (producer.kind === 'video') {
              participant.cameraEnabled = true
            }
          })
        })

        return nextParticipants
      })
    }

    mediaChannel.eventEmitter.on('producers:new', handleNewProducers)
    mediaChannel.eventEmitter.on('participants:info', handleNewProducers)

    return () => {
      mediaChannel.eventEmitter.off('producers:new', handleNewProducers)
      mediaChannel.eventEmitter.off('participants:info', handleNewProducers)
    }
  }, [mediaChannel])

  useEffect(() => {
    const handleUserExit = (userId: number) => {
      setParticipants((prevParticipants) => {
        const nextParticipants = { ...prevParticipants }

        delete nextParticipants[userId]

        return nextParticipants
      })
    }

    mediaChannel.eventEmitter.on('user:exited', handleUserExit)

    return () => {
      mediaChannel.eventEmitter.off('user:exited', handleUserExit)
    }
  }, [mediaChannel])

  useEffect(() => {
    const handleUserJoined = (user: User) => {
      dispatch(setUsers([user]))

      setParticipants((prevParticipants) => {
        const userId = user.id
        const nextParticipants = { ...prevParticipants }
        const participant = nextParticipants[userId]

        if (participant) {
          return prevParticipants
        }

        nextParticipants[userId] = {
          userId,
          micEnabled: false,
          cameraEnabled: false,
        }

        return nextParticipants
      })
    }

    mediaChannel.eventEmitter.on('user:joined', handleUserJoined)

    return () => {
      mediaChannel.eventEmitter.off('user:joined', handleUserJoined)
    }
  }, [mediaChannel, dispatch])

  useEffect(() => {
    const handleCameraOff = (peer: Peer) => {
      setParticipants((prevParticipants) => {
        const nextParticipants = { ...prevParticipants }
        const participant = nextParticipants[peer.userId]

        if (participant) {
          participant.cameraEnabled = false
        }

        return nextParticipants
      })
    }

    mediaChannel.eventEmitter.on('participants:camera:off', handleCameraOff)

    return () => {
      mediaChannel.eventEmitter.off('participants:camera:off', handleCameraOff)
    }
  }, [mediaChannel])

  useEffect(() => {
    const handleMicToggle = (peer: Peer) => {
      setParticipants((prevParticipants) => {
        const nextParticipants = { ...prevParticipants }

        if (nextParticipants[peer.userId]) {
          nextParticipants[peer.userId].micEnabled = !peer.muted
        }

        return nextParticipants
      })
    }

    mediaChannel.eventEmitter.on('participant:mic:toggle', handleMicToggle)

    return () => {
      mediaChannel.eventEmitter.off('participant:mic:toggle', handleMicToggle)
    }
  }, [mediaChannel])

  const value: ContextValue = {
    loading,
    participants,
  }

  return <ParticipantsContext.Provider value={value}>{children}</ParticipantsContext.Provider>
}
