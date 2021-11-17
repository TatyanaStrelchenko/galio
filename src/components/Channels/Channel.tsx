import React from 'react'
import styled from 'styled-components'

import { Channel as ChannelType } from '../../types/space'
import { getColor } from '../../theme/utils'
import { ChatIcon } from '../Icons/ChatIcon'
import { ChatsIcon } from '../Icons/ChatsIcon'
import { useSelector } from 'react-redux'
import { RootState } from '../../types/state'
import { participantsCountSelector } from '../../store/mediaChannels/byId'
import { isTextChannel, isTextChannelType, isVideoChannel } from '../../services/channels'
import { ArchiveIcon } from '../Icons/ArchiveIcon'
import { CameraVideoIcon } from '../Icons/CameraVideoIcon'

type Props = {
  channel: ChannelType
  onChannelSelect: (channel: ChannelType) => void
  active?: boolean
}

export const ChannelWrapper = styled.div<Partial<Props>>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px 6px 38px;
  width: 100%;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  position: relative;
  border-radius: 4px;

  ${({ active }) =>
    active &&
    `
    background: #308575;
    color: white;
    
    .channel-name,
    .icon-holder,
     .icon {
      color: white !important;
    }
    
    .icon {
      position: relative;
    }
  `}

  :hover {
    background: ${({ active }) => getColor(active ? 'success' : 'hover')};

    .icon-circle {
      &:before {
        border-color: ${({ active }) => getColor(active ? 'success' : 'hover')};
      }
    }
  }

  .icon-circle {
    position: relative;

    &:before {
      content: '';
      position: absolute;
      top: 1px;
      left: -3px;
      background: #52d77f;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: block;
      border: 1px solid ${({ active }) => (active ? getColor('success') : getColor('background'))};
      z-index: 1;
    }
  }
`

export const IconWrapper = styled.div<Partial<Props>>`
  position: relative;
  display: flex;
  font-size: 18px;
  margin-right: 8px;
  color: ${({ active }) => (active ? 'white' : getColor('textAlt'))};
`

export const ChannelName = styled.div<Partial<Props>>`
  color: ${({ active }) => (active ? 'white' : getColor('textAlt'))};
`

export const ChannelNameWrapper = styled.div`
  display: flex;
  align-items: center;
`

const ChatMessages = styled.span`
  width: 20px;
  height: 20px;
  background: #e5483f;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  position: absolute;
  right: 15px;
`

const UsersCount = styled.span`
  background: #308575;
  border-radius: 23px;
  color: white;
  min-width: 50px;
  padding: 4px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 15px;
`

const Number = styled.span`
  margin-left: 5px;
`

export const Channel = ({ channel, onChannelSelect, active = false }: Props) => {
  const participantsCount = useSelector((state: RootState) =>
    participantsCountSelector(state, channel.id)
  )
  const textChannel = isTextChannel(channel)
  const videChannel = isVideoChannel(channel)
  const shouldShowBadge = textChannel && channel.unread_messages_count > 0
  const shouldShowBadgeCount = videChannel && participantsCount !== 0
  const handleClick = () => {
    onChannelSelect(channel)
  }

  let Icon = null

  if (isTextChannelType(channel)) {
    Icon = channel.archived ? ArchiveIcon : ChatIcon
  } else {
    Icon = CameraVideoIcon
  }

  return (
    <ChannelWrapper className="channel-wrapper" active={active} onClick={handleClick}>
      <ChannelNameWrapper>
        <IconWrapper active={active} className="icon">
          <Icon />
        </IconWrapper>
        <ChannelName active={active} className="channel-name">
          {channel.name}
        </ChannelName>
        {shouldShowBadge && <ChatMessages>{channel.unread_messages_count}</ChatMessages>}
        {shouldShowBadgeCount && (
          <UsersCount>
            <ChatsIcon />
            <Number>{participantsCount}</Number>
          </UsersCount>
        )}
      </ChannelNameWrapper>
    </ChannelWrapper>
  )
}
