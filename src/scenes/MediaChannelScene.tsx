import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import { AppUrlParams } from '../services/urls'
import { getVideoChannelInfo } from '../services/videoChannels'
import { setUsers } from '../store/users'
import { useSpaces } from '../components/Spaces/SpacesProvider'
import { useVideoHashId } from '../hooks/useVideoHashId'
import { MediaChannelProvider } from '../components/MediaChannel/MediaChannelProvider'
import { ParticipantsProvider } from '../components/MediaChannel/ParticipantsProvider'
import { MediaChannel } from '../components/MediaChannel/MediaChannel'
import { PreviewMediaChannelScene } from './PreviewMediaChannelScene'
import { Spinner } from '../components/Spinner/Spinner'

export const MediaChannelScene = () => {
  const params = useParams<AppUrlParams>()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [showPreviewRoom, setShowPreviewRoom] = useState(true)
  const [startTime, setStartTime] = useState<string>('')
  const {
    joinedVideoChannel,
    selectedVideoChannel,
    currentSpace,
    setSelectedVideoChannel,
    addVideoChannel,
    selectSavedMessagesChannel,
  } = useSpaces()
  const videoHashId = useVideoHashId()

  useEffect(() => {
    if (!selectedVideoChannel) {
      return
    }

    if (joinedVideoChannel?.hash_id === selectedVideoChannel.hash_id) {
      return
    }

    const fetchData = async () => {
      setLoading(true)
      setShowPreviewRoom(true)
      setError(null)

      try {
        const videoChannelInfo = await getVideoChannelInfo(selectedVideoChannel.hash_id)

        setStartTime(videoChannelInfo.start_time)
        dispatch(setUsers(videoChannelInfo.users))
      } catch (e) {
        setError(e)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dispatch, joinedVideoChannel, selectedVideoChannel, setSelectedVideoChannel])

  useEffect(() => {
    if (params.type === 't' || !videoHashId || selectedVideoChannel?.hash_id === videoHashId) {
      return
    }

    const videoChannel = currentSpace.video_channels.find(({ hash_id }) => hash_id === videoHashId)

    if (videoChannel) {
      return
    }

    const fetchExternalCall = async () => {
      try {
        const videoChannelInfo = await getVideoChannelInfo(videoHashId)
        const externalVideoChannel = {
          hash_id: videoHashId,
          name: videoChannelInfo.name,
          video_host: false,
          isExternal: true,
        }

        setStartTime(videoChannelInfo.start_time)
        setSelectedVideoChannel(externalVideoChannel)
        addVideoChannel(externalVideoChannel, true)
      } catch (e) {
        selectSavedMessagesChannel()
      }
    }

    fetchExternalCall()
  }, [
    params.type,
    videoHashId,
    currentSpace,
    selectedVideoChannel,
    setSelectedVideoChannel,
    addVideoChannel,
    selectSavedMessagesChannel,
  ])

  if (!selectedVideoChannel) {
    return null
  }

  if (loading) {
    return <Spinner align="center" />
  }

  if (error) {
    return <div>Video Call Not Found</div>
  }

  const handleJoinRoom = () => {
    setShowPreviewRoom(false)
  }

  const handleDisconnect = () => {
    setShowPreviewRoom(true)
  }

  return (
    <MediaChannelProvider channelId={selectedVideoChannel.hash_id}>
      <ParticipantsProvider>
        {showPreviewRoom ? (
          <PreviewMediaChannelScene startTime={startTime} onJoin={handleJoinRoom} />
        ) : (
          <MediaChannel onDisconnect={handleDisconnect} />
        )}
      </ParticipantsProvider>
    </MediaChannelProvider>
  )
}
