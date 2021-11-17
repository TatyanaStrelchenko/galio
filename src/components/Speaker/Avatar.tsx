import React from 'react'
import styled from 'styled-components'

import { User } from '../../types/user'
import { changeUserAvatarSize } from '../../services/users'
import { FlexBox } from '../Box/Box'

const AVATAR_SIZE = 200

const AvatarWrapper = styled(FlexBox)`
  height: 100%;
`

const Image = styled.img`
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
`

type Props = {
  user: User | null
  className?: string
}

export const Avatar = ({ className, user }: Props) => {
  return (
    <AvatarWrapper className="avatar-wrapper" justifyContent="center" alignItems="center">
      <Image
        className={className}
        src={changeUserAvatarSize(user?.picture ?? '', AVATAR_SIZE)}
        alt={user?.name}
        referrerPolicy="no-referrer"
      />
    </AvatarWrapper>
  )
}
