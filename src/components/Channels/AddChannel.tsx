import React from 'react'

import { VideoChannel } from '../../types/space'
import { createVideoChannel } from '../../services/videoChannels'
import { AddChannelForm, Values } from './AddChannelForm'
import { useSpaces } from '../Spaces/SpacesProvider'

type Props = {
  onChannelAdd: (videoChannel: VideoChannel) => void
  className?: string
  channelNameExternal?: string
  channelId?: string
  setSubmitFormOnBlur: boolean
}

export const AddChannel = ({
  onChannelAdd,
  channelNameExternal,
  channelId,
  className,
  setSubmitFormOnBlur,
}: Props) => {
  const { currentSpace } = useSpaces()

  const handleChannelSubmit = async (values: Values) => {
    try {
      const channel = await createVideoChannel(values.name, channelId)
      onChannelAdd(channel)
    } catch (e) {
      console.log('Failed to create channel', e)
    }
  }

  let initialValues = {
    name: channelNameExternal || `Video Call ${currentSpace.video_channels.length + 1}`,
  }

  return (
    <div className={className}>
      <AddChannelForm
        originValues={initialValues}
        onSubmit={handleChannelSubmit}
        setSubmitFormOnBlur={setSubmitFormOnBlur}
        isExternal={channelNameExternal ? true : false}
      />
    </div>
  )
}
