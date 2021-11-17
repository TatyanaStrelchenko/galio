import React, { Fragment } from 'react'
import styled from 'styled-components'

import { User } from '../../types/user'
import { useMyMediaStream } from '../Me/MyMediaStreamProvier'
import { FlexBox } from '../Box/Box'
import { Avatar } from '../Avatar/Avatar'
import { Text } from '../Typography/Text'
import { Video } from '../Media/Media'

const Container = styled(FlexBox)`
  margin: 16px 0 8px 0;
  height: calc(100% - 45px);
`

const VideoContainer = styled(FlexBox)`
  border-radius: 8px;
  background-color: #ffffff;
  height: 100%;
  width: 100%;
  overflow: hidden;
`

const UserName = styled(Text)`
  margin-top: 16px;
`

const AVATAR_SIZE = 120

type Props = {
  user: User
}

export const VideoPreview = ({ user }: Props) => {
  const { videoStream } = useMyMediaStream()

  return (
    <Container justifyContent="center">
      <VideoContainer alignItems="center" justifyContent="center" direction="column">
        {videoStream ? (
          <Fragment>
            <Video kind="video" stream={videoStream} />
          </Fragment>
        ) : (
          <Fragment>
            <Avatar user={user} size={AVATAR_SIZE} />
            <UserName bold size="big">
              {user.name}
            </UserName>
          </Fragment>
        )}
      </VideoContainer>
    </Container>
  )
}
