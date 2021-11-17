import React, { useState } from 'react'
import styled from 'styled-components'
import toast from '../../utils/toaster'
import 'react-toastify/dist/ReactToastify.css'
import ReactTooltip from 'react-tooltip'

import { VideoChannel as VideoChannelType } from '../../types/space'
import { ChannelWrapper, ChannelNameWrapper, ChannelName, IconWrapper } from '../Channels/Channel'
import { SvgIconProps } from '../Icons/SvgIcon'
import { CameraVideoIcon } from '../Icons/CameraVideoIcon'
import { CopyIcon } from '../Icons/CopyIcon'
import { EllipsisIcon } from '../Icons/EllipsisIcon'
import { generateAppUrl } from '../../services/urls'
import { useSpaces } from '../Spaces/SpacesProvider'
import { AddChannelButton } from '../Channels/AddChannelButton'
import { AddChannel } from '../Channels/AddChannel'

type Props = {
  videoChannel: VideoChannelType
  onChannelSelect: (videoChannel: VideoChannelType) => void
  active?: boolean
  icon?: React.ElementType<SvgIconProps>
}

export const IconsHolder = styled.div`
  display: flex;
  justify-content: space-between;
  width: 40px;
  visibility: hidden;
`

const IconHolder = styled.span`
  &:hover {
    color: #308575;
  }
`

const VideoChannelWrapper = styled(ChannelWrapper)`
  padding: 0;
  position: relative;

  :hover {
    ${IconsHolder} {
      visibility: visible;
    }
  }
`

type AddChannelButtonProps = {
  active: boolean
}

export const SaveChannelButton = styled(AddChannelButton)<AddChannelButtonProps>`
  color: white;
  cursor: pointer;
  height: 20px;
  font-size: 12px;
  line-height: 1.6;
  padding: 0 5px;
  border-radius: 4px;
  background: ${({ active }) => (active ? 'white' : '#308575')};
  color: ${({ active }) => (active ? '#308575' : 'white')};
  display: flex;
  align-items: center;

  &:hover {
    background: #1e554b;
  }

  ${({ active }) =>
    active &&
    `
      &:hover {
        background: #E5E5E5;
      }
  `}
`

const ExternalCallWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 6px 10px 6px 38px;

  .tooltip {
    width: 240px;
    background: white;
    color: #272727;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.02);
    border-radius: 4px;
    padding: 8px;
    margin: 4px 0;
    font-size: 12px;
    line-height: 1.8;
    opacity: 1 !important;
    margin-top: -4px !important;

    &:before,
    &:after {
      display: none;
    }
  }
`

const AddChannelExternal = styled(AddChannel)`
  .input-holder {
    padding: 0;
    color: white;
  }

  .input-custom {
    color: #97c2ba;
    opacity: 1;

    ::placeholder {
      color: #97c2ba;
    }
  }
`

const CallWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px 6px 38px;
`

export const VideoChannel = ({
  videoChannel,
  onChannelSelect,
  active = false,
  icon: Icon = CameraVideoIcon,
}: Props) => {
  const { addVideoChannel, joinedVideoChannel } = useSpaces()
  const [showButton, setShowButton] = useState(true)
  const [submitFormOnBlur, setSubmitFormOnBlur] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  const handleClick = () => {
    onChannelSelect(videoChannel)
  }

  const copyToClipboard = (e: React.MouseEvent) => {
    const url = generateAppUrl.href({ type: 'v', hash: videoChannel.hash_id })
    navigator.clipboard.writeText(url)
    toast('success', 'Call link copied to clipboard')
    e.stopPropagation()
  }

  const handleChannelAdd = (videoChannel: VideoChannelType) => {
    addVideoChannel(videoChannel)
  }

  const handleToggleInput = () => {
    setShowAddForm(true)
    setShowButton(false)
    setSubmitFormOnBlur(true)
  }

  const isExternalCall = videoChannel.isExternal
  const isCurrentVideoChannel = joinedVideoChannel?.hash_id === videoChannel.hash_id

  return (
    <VideoChannelWrapper active={active} onClick={handleClick}>
      {isExternalCall ? (
        <ExternalCallWrapper data-tip="Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown">
          <ChannelNameWrapper>
            {!showAddForm && (
              <>
                <IconWrapper className={`${isCurrentVideoChannel ? 'icon icon-circle' : 'icon'}`}>
                  <Icon fill={videoChannel.video_host ? 'currentColor' : 'none'} />
                </IconWrapper>
                <ChannelName className="channel-name">{videoChannel.name}</ChannelName>
              </>
            )}
            {showAddForm && (
              <AddChannelExternal
                onChannelAdd={handleChannelAdd}
                channelNameExternal={videoChannel.name}
                channelId={videoChannel.hash_id}
                className="add-channel-external"
                setSubmitFormOnBlur={submitFormOnBlur}
              />
            )}
          </ChannelNameWrapper>
          {showButton && (
            <SaveChannelButton active={active} onAddClick={handleToggleInput}>
              Save
            </SaveChannelButton>
          )}
          <ReactTooltip
            effect="solid"
            place="top"
            className="tooltip"
            backgroundColor="white"
            type="light"
          />
        </ExternalCallWrapper>
      ) : (
        <CallWrapper>
          <ChannelNameWrapper>
            <IconWrapper className={`${isCurrentVideoChannel ? 'icon icon-circle' : 'icon'}`}>
              <Icon fill={videoChannel.video_host ? 'currentColor' : 'none'} />
            </IconWrapper>
            <ChannelName className="channel-name">{videoChannel.name}</ChannelName>
          </ChannelNameWrapper>
          <IconsHolder>
            <IconHolder className="icon-holder" onClick={(e) => copyToClipboard(e)}>
              <CopyIcon />
            </IconHolder>
            <IconHolder className="icon-holder">
              <EllipsisIcon />
            </IconHolder>
          </IconsHolder>
        </CallWrapper>
      )}
    </VideoChannelWrapper>
  )
}
