import React, { Fragment } from 'react'

import { VideoChannel as VideoChannelType } from '../../types/space'
import { VideoChannel } from './VideoChannel'
import { useSpaces } from '../Spaces/SpacesProvider'

type Props = {
  videoChannels: VideoChannelType[]
  selectedVideoChannel: VideoChannelType | null
  onChannelSelect: (videoChannel: VideoChannelType) => void
}

export const VideoChannels = ({ videoChannels, selectedVideoChannel, onChannelSelect }: Props) => {
  const { selectedTextChannel } = useSpaces()

  return (
    <Fragment>
      {videoChannels.map((videoChannel) => (
        <VideoChannel
          key={videoChannel.hash_id}
          active={Boolean(
            videoChannel.hash_id === selectedVideoChannel?.hash_id && !selectedTextChannel
          )}
          videoChannel={videoChannel}
          onChannelSelect={onChannelSelect}
        />
      ))}
    </Fragment>
  )
}
