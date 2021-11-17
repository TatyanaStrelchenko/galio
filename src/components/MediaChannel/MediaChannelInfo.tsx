import React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'

import { VideoChannel, VideoChannelJoinResult } from '../../types/space'
import { showSidebarSelector, toggleShowSidebar } from '../../store/ui/ui'
import { FlexBox } from '../Box/Box'
import { Text } from '../Typography/Text'
import { Controls } from './Controls'
import { MenuIcon } from '../Icons/MenuIcon'
import { ChatIcon } from '../Icons/ChatIcon'
import { RecordIcon } from '../Icons/RecordIcon'
import { SettingsIcon } from '../Icons/SettingsIcon'
import { UsersIcon } from '../Icons/UsersIcon'
import { useMyParticipants } from './ParticipantsProvider'
import { Button } from '../Button/Button'
import { CallTime as BaseCallTime } from './CallTime'

const PanelInfo = styled(FlexBox)`
  position: fixed;
  right: 0;
  bottom: 0;
  width: 100%;
  max-height: 56px;
  min-height: 56px;
  background: black;
  padding: 8px 18px;
  color: white;
  z-index: 10;
  font-weight: 500;
  font-size: 14px;
`

const ListItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 24px;

  &:last-of-type {
    margin: 0;
  }
`

const ButtonMenu = styled(Button)`
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 0 2px;
  background: none;

  &:active,
  &:hover,
  &:focus {
    border-radius: 2px;
    background: #2e2e2e;
    box-shadow: none;
  }

  ${({ active }) =>
    active &&
    `
      color: #308575;
    `}
`

const CallTime = styled(BaseCallTime)`
  position: relative;

  &:before {
    content: '';
    position: absolute;
    left: -15px;
    top: 50%;
    margin: -2px 0 0;
    width: 4px;
    height: 4px;
    background: #676767;
    border-radius: 50%;
  }
`

const IconHolder = styled.span`
  display: flex;
  margin-right: 8px;
  font-size: 20px;
`

const RecordContainer = styled.div`
  display: flex;
  align-items: center;
  opacity: 0.5;
`

const InfoText = styled.span`
  font-size: 14px;
`

type Props = {
  compact: boolean
  isShowVideoChat: boolean
  isShowParticipants: boolean
  onChatClick: () => void
  onParticipantsClick: () => void
  onDisconnect: () => void
  channel?: VideoChannel | null
  joinResult?: VideoChannelJoinResult
}

export const MediaChannelInfo = ({
  channel,
  joinResult,
  compact,
  onChatClick,
  isShowVideoChat,
  isShowParticipants,
  onParticipantsClick,
  onDisconnect,
}: Props) => {
  const myParticipants = useMyParticipants()
  const showSidebar = useSelector(showSidebarSelector)

  const dispatch = useDispatch()

  const handleButtonSidebarClick = () => {
    dispatch(toggleShowSidebar())
  }

  return (
    <PanelInfo justifyContent="space-between" alignItems="center">
      <FlexBox width="33.33%" alignItems="center" justifyContent="flex-start">
        <ListItem>
          <ButtonMenu active={showSidebar} onClick={handleButtonSidebarClick}>
            <MenuIcon />
          </ButtonMenu>
        </ListItem>
        <ListItem>
          <ButtonMenu active={isShowVideoChat} onClick={onChatClick}>
            <ChatIcon fill={`${isShowVideoChat && '#308575'}`} />
          </ButtonMenu>
        </ListItem>
        <ListItem>
          <Text variant="white">{channel?.name || 'Video Call'}</Text>
        </ListItem>
        {joinResult && (
          <ListItem>
            <CallTime startTime={joinResult.startTime} variant="white" />
          </ListItem>
        )}
      </FlexBox>
      <FlexBox width="33.33%" justifyContent="center">
        <Controls compact={compact} onChatClick={onChatClick} onDisconnect={onDisconnect} />
      </FlexBox>
      <FlexBox width="33.33%" justifyContent="flex-end">
        <ListItem>
          <ButtonMenu>
            <RecordContainer>
              <IconHolder>
                <RecordIcon stroke="#676767" fill="white" />
              </IconHolder>
              <InfoText>Record</InfoText>
            </RecordContainer>
          </ButtonMenu>
        </ListItem>
        <ListItem>
          <ButtonMenu>
            <SettingsIcon />
          </ButtonMenu>
        </ListItem>
        <ListItem>
          <ButtonMenu active={isShowParticipants} onClick={onParticipantsClick}>
            <IconHolder>
              <UsersIcon />
            </IconHolder>
            <InfoText>{myParticipants.length + 1}</InfoText>
          </ButtonMenu>
        </ListItem>
      </FlexBox>
    </PanelInfo>
  )
}
