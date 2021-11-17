import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { Channel, Space, VideoChannel } from '../../types/space'
import { isTextChannelType } from '../../services/channels'
import { AppUrlParams, generateAppUrl } from '../../services/urls'
import {
  addTextChannel,
  savedMessagesChannelSelector,
  setSelectedChannel,
  textChannelSelector,
  textChannelsSelector,
} from '../../store/textChannels/textChannels'

type ContextProps = {
  spaces: Space[]
  currentSpace: Space
  addChannel: (space: Space, channel: Channel) => void
  selectedVideoChannel: VideoChannel | null
  selectedTextChannel: Channel | null
  selectVideoChannel: (videoChannel: VideoChannel | null, deselectTextChannel?: boolean) => void
  selectTextChannel: (channel: Channel | null) => void
  joinedVideoChannel: VideoChannel | null
  setJoinedVideoChannel: (videoChannel: VideoChannel | null) => void
  selectSavedMessagesChannel: () => void
  addVideoChannel: (videoChannel: VideoChannel, appendToHeader?: boolean) => void
  setSelectedVideoChannel: (videoChannel: VideoChannel | null) => void
}

const SpacesContext = createContext<ContextProps>({
  spaces: [],
  currentSpace: {} as Space,
  addChannel: () => {},
  selectedVideoChannel: null,
  selectedTextChannel: null,
  selectVideoChannel: () => {},
  selectTextChannel: () => {},
  joinedVideoChannel: null,
  setJoinedVideoChannel: () => {},
  selectSavedMessagesChannel: () => {},
  addVideoChannel: () => {},
  setSelectedVideoChannel: () => {},
})

export const useSpaces = () => {
  return useContext(SpacesContext)
}

type TextChannelsOptions = {
  archived: boolean
}

export const useFirstVideoChannel = (): VideoChannel | undefined => {
  const { currentSpace } = useContext(SpacesContext)
  const [videoChannel] = currentSpace.video_channels

  return videoChannel
}

export const useVideoChannels = () => {
  const { currentSpace } = useContext(SpacesContext)

  return currentSpace.video_channels
}

export const useTextChannels = ({ archived }: TextChannelsOptions = { archived: false }) => {
  const textChannels = useSelector(textChannelsSelector)

  return textChannels.filter(isTextChannelType).filter((channel) => channel.archived === archived)
}

type ChannelLike = Pick<Channel, 'hash_id'> | Pick<VideoChannel, 'hash_id'>

function findByIdPredicate<T extends ChannelLike>(channels: T[], hash: string) {
  return channels.find((channel) => channel.hash_id === hash)
}

type Props = AppUrlParams & {
  initialSpaces: Space[]
  children: React.ReactNode
}

export const SpacesProvider = ({ type, hash, initialSpaces, children }: Props) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const selectedTextChannel = useSelector(textChannelSelector)
  const savedMessagesChannel = useSelector(savedMessagesChannelSelector)
  const [spaces, setSpaces] = useState<Space[]>(initialSpaces)
  const [currentSpace, setCurrentSpace] = useState<Space>(initialSpaces[0])
  const [joinedVideoChannel, setJoinedVideoChannel] = useState<VideoChannel | null>(null)
  const [selectedVideoChannel, setSelectedVideoChannel] = useState<VideoChannel | null>(null)

  useEffect(() => {
    if (!(type && hash)) {
      return
    }

    const selectTextChannel = () => {
      const textChannel = findByIdPredicate(currentSpace.channels, hash)

      textChannel && dispatch(setSelectedChannel(textChannel))
    }

    const selectVideoChannel = () => {
      const videoChannel = findByIdPredicate(currentSpace.video_channels, hash)

      videoChannel && setSelectedVideoChannel(videoChannel)
    }

    if (type === 't') {
      selectTextChannel()
    } else if (type === 'v') {
      selectVideoChannel()
    }

    // todo:
    // if (isVideoChannel(channel)) {
    //   setSelectedVideoChannel(channel)
    // } else {
    //   dispatch(setSelectedChannel(channel))
    // }

    // dispatch(setSelectedChannel(channel))
  }, [type, hash, currentSpace, dispatch])

  const addChannel = (space: Space, channel: Channel) => {
    const spaceIndex = spaces.indexOf(space)

    if (spaceIndex === -1) {
      return
    }

    const nextSpaces = [...spaces]
    nextSpaces[spaceIndex].channels.push(channel)

    setSpaces(nextSpaces)

    if (channel.type === 'TEXT_CHANNEL') {
      dispatch(addTextChannel(channel))
    }
  }

  const selectVideoChannel = (
    videoChannel: VideoChannel | null,
    deselectTextChannel: boolean = true
  ) => {
    if (
      joinedVideoChannel &&
      videoChannel !== null &&
      videoChannel.hash_id !== selectedVideoChannel?.hash_id
    ) {
      return
    }

    if (deselectTextChannel) {
      dispatch(setSelectedChannel(null))
    }

    if (videoChannel) {
      setSelectedVideoChannel(videoChannel)
    } else {
      setSelectedVideoChannel(null)
      setJoinedVideoChannel(null)
    }

    history.replace(generateAppUrl({ type: 'v', hash: videoChannel?.hash_id }))
    // dispatch(setSelectedChannel(null))
    //
    // if (!channel) {
    //   setSelectedVideoChannel(null)
    //   setIsJoinedToRoom(false)
    // }
    //
  }

  const selectTextChannel = useCallback(
    (channel: Channel | null) => {
      if (!joinedVideoChannel) {
        setSelectedVideoChannel(null)
      }

      dispatch(setSelectedChannel(channel))

      if (!channel) {
        return
      }

      history.replace(generateAppUrl({ type: 't', hash: channel.hash_id }))
    },
    [joinedVideoChannel, setSelectedVideoChannel, history, dispatch]
  )

  const selectSavedMessagesChannel = useCallback(() => {
    selectTextChannel(savedMessagesChannel)
  }, [selectTextChannel, savedMessagesChannel])

  useEffect(() => {
    if (selectedVideoChannel || selectedTextChannel) {
      return
    }

    if (hash && type === 'v') {
      return
    }

    if (hash && type === 't' && findByIdPredicate(currentSpace.channels, hash)) {
      return
    }

    selectSavedMessagesChannel()
  }, [
    currentSpace,
    type,
    hash,
    selectedVideoChannel,
    selectedTextChannel,
    selectSavedMessagesChannel,
  ])

  const addVideoChannel = useCallback((videoChannel: VideoChannel, appendToHeader = false) => {
    setCurrentSpace((prevSpace) => {
      const nextSpace = { ...prevSpace }

      const externalCallIndex = nextSpace.video_channels.findIndex(({ hash_id, isExternal }) => {
        return hash_id === videoChannel.hash_id && isExternal
      })

      if (externalCallIndex !== -1) {
        nextSpace.video_channels.splice(externalCallIndex, 1)
      }

      if (appendToHeader) {
        nextSpace.video_channels.unshift(videoChannel)
      } else {
        nextSpace.video_channels.push(videoChannel)
      }

      return nextSpace
    })
  }, [])

  const value = {
    spaces,
    currentSpace,
    addChannel,
    selectedVideoChannel,
    selectedTextChannel,
    selectVideoChannel,
    selectTextChannel,
    joinedVideoChannel,
    setJoinedVideoChannel,
    selectSavedMessagesChannel,
    addVideoChannel,
    setSelectedVideoChannel,
  }

  return <SpacesContext.Provider value={value}>{children}</SpacesContext.Provider>
}
