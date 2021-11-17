import React from 'react'
import styled from 'styled-components'

import { User } from '../../types/user'
import { changeUserAvatarSize } from '../../services/users'

const AVATAR_SIZE = 64

type ImageProps = {
  size: number
  centered: boolean
}

const Image = styled.img<ImageProps>`
  height: ${({ size }) => `${size}px`};
  width: ${({ size }) => `${size}px`};
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin: ${({ centered }) => (centered ? '0 auto' : '0')};
`

type Props = {
  user: User
  size?: number
  className?: string
  centered?: boolean
}

export const Avatar = ({ user, className, size = AVATAR_SIZE, centered = true }: Props) => {
  return (
    <Image
      className={className}
      size={size}
      centered={centered}
      src={changeUserAvatarSize(user.picture, size)}
      alt={user.name}
      referrerPolicy="no-referrer"
    />
  )
}
