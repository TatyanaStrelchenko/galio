import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'

import { Space } from '../types/space'
import { setTextChannels } from '../store/textChannels/textChannels'
import { isTextChannelType } from '../services/channels'
import { AppUrlParams } from '../services/urls'

import { getPersonalSpace } from '../services/spaces'
import { useUser } from '../components/User/UserProvider'
import { SpacesProvider } from '../components/Spaces/SpacesProvider'
import { MyMediaStreamProvider } from '../components/Me/MyMediaStreamProvier'
import { ChannelsScene } from './ChannelsScene'
import { MediaChannelScene } from './MediaChannelScene'
import { TextChannelScene } from './TextChannelScene'
import { Spinner } from '../components/Spinner/Spinner'
import { uiSelector } from '../store/ui/ui'
import { Transition, TransitionStatus, TransitionGroup } from 'react-transition-group'

type ContentProps = {
  isFullScreenVideoCall: boolean
}

const duration = 0.5

const sidebarStyle = {
  transition: `all ${duration}ms`,
}

const contentStyle = {
  transition: `transform ${duration}ms`,
}

const contentTransitionStyle: { [key in TransitionStatus]?: any } = {
  entering: { transform: 'translate3d(0, 0, 0)' },
  entered: { transform: 'translate3d(0, 0, 0)' },
  exiting: { transform: 'translate3d(0, 0, 0)' },
  exited: { transform: 'translate3d(0, 0, 0)' },
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

const Content = styled.div`
  height: 100vh;
  display: flex;
  position: relative;
`

const ChannelsContent = styled.div`
  width: 100%;
  min-width: 0;
  perspective: 1000px;
  position: relative;
`

export const AppScene = () => {
  const params = useParams<AppUrlParams>()
  const { user } = useUser()
  const dispatch = useDispatch()
  const [space, setSpace] = useState<Space>()
  const [loading, setLoading] = useState(true)
  const uiState = useSelector(uiSelector)
  const { showSidebar } = useSelector(uiSelector)

  useEffect(() => {
    localStorage.setItem('ui', JSON.stringify(uiState))
  }, [uiState])

  useEffect(() => {
    const fetchData = async () => {
      const space = await getPersonalSpace()

      dispatch(setTextChannels(space.channels.filter(isTextChannelType)))
      setSpace(space)
      setLoading(false)
    }

    fetchData()
  }, [user, dispatch])

  if (loading) {
    return <Spinner align="center" />
  }

  if (!space) {
    return <div>Failed to load space</div>
  }

  return (
    <SpacesProvider type={params.type} hash={params.hash} initialSpaces={[space]}>
      <MyMediaStreamProvider>
        <TransitionGroup>
          <Content className="main-content">
            <ChannelsScene />
            <Transition in={showSidebar} timeout={300}>
              {(state) => (
                <ChannelsContent
                  style={{
                    ...contentStyle,
                    ...contentTransitionStyle[state],
                  }}
                >
                  <TextChannelScene />
                  <MediaChannelScene />
                </ChannelsContent>
              )}
            </Transition>
          </Content>
        </TransitionGroup>
      </MyMediaStreamProvider>
    </SpacesProvider>
  )
}
