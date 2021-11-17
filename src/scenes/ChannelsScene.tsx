import React, { Fragment, useState } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'

import { theme, darkTheme } from '../theme/theme'
import { getColor } from '../theme/utils'
import { VideoChannel as VideoChannelType } from '../types/space'
import { toggleAccordionsState, uiSelector } from '../store/ui/ui'
import { isSavedMessagesChannel, isVideoArchiveChannel } from '../services/channels'
import { useSpaces, useTextChannels, useVideoChannels } from '../components/Spaces/SpacesProvider'
import { useUser } from '../components/User/UserProvider'
import { AddChannelButton } from '../components/Channels/AddChannelButton'
import { Channels } from '../components/Channels/Channels'
import { Avatar } from '../components/Avatar/Avatar'
import { SavedIcon } from '../components/Icons/SavedIcon'
import { VideoChannels } from '../components/VideoChannels/VideoChannels'
import { SaveChannelButton } from '../components/VideoChannels/VideoChannel'
import { Accordion } from '../components/Accordion/Accordion'
import { ButtonFullWidth, EmptyVideoCall } from '../components/EmptyVideoCall/EmptyVideoCall'
import { PlusIcon } from '../components/Icons/PlusIcon'
import { AddChannel } from '../components/Channels/AddChannel'
import { hiddenScrollbarMixin } from '../components/Style/Scrollbar'
import { Transition, TransitionStatus } from 'react-transition-group'

const AddChannelButtonSmall = styled(AddChannelButton)`
  color: #6c6e6e;
  position: absolute;
  right: 5px;
  top: 7px;
  cursor: pointer;
  visibility: hidden;
  height: 16px;

  &:hover {
    background: #d7dddc;
  }
`

type ContentProps = {
  isFullScreenVideoCall: boolean
}

const duration = 1

const sidebarStyle = {
  transition: `width ${duration}ms`,
}

const sidebarTransitionStyle: { [key in TransitionStatus]?: any } = {
  entering: { width: '260px' },
  entered: { width: '260px' },
  exiting: { width: '0' },
  exited: { width: '0' },
}
const linkStyle = {
  transition: `opacity ${duration}ms`,
}
const linkTransitionStyles: { [key in TransitionStatus]?: any } = {
  // entering: { opacity: 0 },
  // entered: { opacity: 1 },
  // exiting: { opacity: 1 },
  // exited: { opacity: 0 },
}

const Content = styled.div<ContentProps>`
  width: 260px;
  padding: 0 8px;
  min-width: 260px;
  height: 100vh;
  background-color: ${getColor('background')};
  overflow-y: auto;
  ${hiddenScrollbarMixin}

  :hover {
    ${AddChannelButtonSmall} {
      visibility: visible;
    }
  }

  ${({ isFullScreenVideoCall }) =>
    isFullScreenVideoCall &&
    `
    // height: calc(100% - 56px);
      height: 100vh;

    transition: all 1s ease-out;
    min-width: 0;
    width: 260px;
    // position: absolute;
    // left: 0;
    // top: 0;
    padding: 0;
    z-index: 100;
  `}
`

const TitleScene = styled.div`
  padding: 11px 8px 10px;
  display: flex;
  align-items: center;
`

const TitleSpace = styled.h1`
  color: ${getColor('text')};
  font-size: 14px;
  line-height: 24px;
  margin-left: 8px;
  font-weight: 500;
`

const ChatCategoryTitle = styled.h2`
  font-size: 14px;
  line-height: 16px;
  color: ${getColor('textAlt')};
`

const CategoryIcon = styled.span`
  height: 16px;
  margin-right: 11px;
  color: ${getColor('textAlt')};
`

type ChatCategoryProps = {
  active?: boolean
  actionable?: boolean
}

const ChatCategory = styled.div<ChatCategoryProps>`
  display: flex;
  align-items: center;
  letter-spacing: 0.05em;
  color: #6c6e6e;
  padding: 8px 11px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  ${({ active }) =>
    active &&
    `
    background: #308575 !important;
    color: white;
    border-radius: 4px;
    
    .title {
        color: white;
    }
     ${SaveChannelButton} {
      background: white;
    }
    ${CategoryIcon} {
        color: white;
    }
  `}
`

const AccordionHolder = styled.div`
  position: relative;
`

const IconWrapper = styled.div`
  color: white;
  display: flex;
  font-size: 18px;
  margin-right: 8px;
`

type Props = {
  state: TransitionStatus[]
}

export const ChannelsScene = (state: any) => {
  const { showSidebar, accordions } = useSelector(uiSelector)

  const [sidebar, closeSidebar] = useState(showSidebar)

  const dispatch = useDispatch()
  const { user } = useUser()
  const {
    joinedVideoChannel,
    selectedVideoChannel,
    selectedTextChannel,
    selectTextChannel,
    selectVideoChannel,
    selectSavedMessagesChannel,
    addVideoChannel,
  } = useSpaces()
  const videoChannels = useVideoChannels()
  const archivedTextChannels = useTextChannels({ archived: true })

  const [showAddForm, setShowAddForm] = useState(false)

  const handleShowSidebar = () => {
    closeSidebar(false)
  }

  const isSavedMessagesSelected = selectedTextChannel
    ? isSavedMessagesChannel(selectedTextChannel)
    : false

  const showExternalVideoChannel =
    selectedVideoChannel &&
    !videoChannels.find(({ hash_id }) => hash_id === selectedVideoChannel.hash_id)
  const shouldShowEmptyVideoBlock =
    !showExternalVideoChannel && videoChannels.length <= 0 && !showAddForm

  const handleChannelAdd = (videoChannel: VideoChannelType) => {
    addVideoChannel(videoChannel)
    setShowAddForm(false)
  }

  const handleSavedMessagesClick = () => {
    selectSavedMessagesChannel()
  }

  const handleVideoChannelSelect = (videoChannel: VideoChannelType) => {
    selectVideoChannel(videoChannel)
  }

  const handleTextChannelsOpenChange = (isTextChannelsOpen: boolean) => {
    dispatch(toggleAccordionsState({ isTextChannelsOpen }))
  }

  const handleVideoChannelsOpenChange = (isVideoChannelsOpen: boolean) => {
    dispatch(toggleAccordionsState({ isVideoChannelsOpen }))
  }

  const archiveTitle = <ChatCategoryTitle className="title">Archive</ChatCategoryTitle>
  const videoTitle = <ChatCategoryTitle className="title">Video Calls</ChatCategoryTitle>

  const isTextChannelsAccordionOpen =
    accordions.isTextChannelsOpen ||
    (!!selectedTextChannel && isVideoArchiveChannel(selectedTextChannel))
  const isVideoChannelsAccordionOpen =
    accordions.isVideoChannelsOpen || Boolean(selectedVideoChannel)
  const isFullScreenVideoCall = Boolean(joinedVideoChannel && !selectedTextChannel)
  const handleToggleInput = () => {
    setShowAddForm(true)
  }
  return (
    <ThemeProvider theme={isFullScreenVideoCall ? darkTheme : theme}>
      <Transition in={showSidebar} timeout={300}>
        {(state) => (
          <Content
            isFullScreenVideoCall={isFullScreenVideoCall}
            style={{
              ...sidebarStyle,
              ...sidebarTransitionStyle[state],
            }}
          >
            <TitleScene>
              <Avatar user={user} size={32} centered={false} />
              <TitleSpace>{user.name}</TitleSpace>
            </TitleScene>
            <ChatCategory
              actionable
              active={isSavedMessagesSelected}
              onClick={handleSavedMessagesClick}
            >
              <CategoryIcon>
                <SavedIcon strokeWidth="1.5" />
              </CategoryIcon>
              <ChatCategoryTitle className="title">Saved Messages</ChatCategoryTitle>
            </ChatCategory>
            <Accordion
              title={archiveTitle}
              initialIsOpen={isTextChannelsAccordionOpen}
              onOpenChange={handleTextChannelsOpenChange}
            >
              <Channels
                selectedChannel={selectedTextChannel}
                channels={archivedTextChannels}
                onChannelSelect={selectTextChannel}
              />
            </Accordion>
            <AccordionHolder>
              <Accordion
                title={videoTitle}
                initialIsOpen={isVideoChannelsAccordionOpen}
                onOpenChange={handleVideoChannelsOpenChange}
              >
                {shouldShowEmptyVideoBlock ? (
                  <Fragment>
                    {showAddForm && (
                      <AddChannel onChannelAdd={handleChannelAdd} setSubmitFormOnBlur={true} />
                    )}
                    <EmptyVideoCall />
                    <AddChannelButton onAddClick={handleToggleInput}>
                      <ButtonFullWidth variant="success">
                        <IconWrapper>
                          <PlusIcon />
                        </IconWrapper>
                        Create Video Call
                      </ButtonFullWidth>
                    </AddChannelButton>
                  </Fragment>
                ) : (
                  <>
                    <VideoChannels
                      videoChannels={videoChannels}
                      selectedVideoChannel={selectedVideoChannel}
                      onChannelSelect={handleVideoChannelSelect}
                    />
                    {showAddForm && (
                      <AddChannel onChannelAdd={handleChannelAdd} setSubmitFormOnBlur={true} />
                    )}
                  </>
                )}
              </Accordion>
              {!shouldShowEmptyVideoBlock && (
                <AddChannelButtonSmall onAddClick={handleToggleInput}>
                  <PlusIcon />
                </AddChannelButtonSmall>
              )}
            </AccordionHolder>
          </Content>
        )}
      </Transition>
    </ThemeProvider>
  )
}
