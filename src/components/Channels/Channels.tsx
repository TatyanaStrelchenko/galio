import React from 'react'
import styled from 'styled-components'

import { Channel as ChannelType } from '../../types/space'
import { Channel } from './Channel'

const ChannelsWrapper = styled.div``

type Props = {
  selectedChannel: ChannelType | null
  channels: ChannelType[]
  onChannelSelect: (channel: ChannelType) => void
}

export const Channels = ({ selectedChannel, channels, onChannelSelect }: Props) => {
  return (
    <ChannelsWrapper>
      {channels.map((channel) => (
        <Channel
          key={channel.id}
          channel={channel}
          active={channel.id === selectedChannel?.id}
          onChannelSelect={onChannelSelect}
        />
      ))}
    </ChannelsWrapper>
  )
}
