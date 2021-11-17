import React, { useState, useEffect, useRef } from 'react'
import styled, { keyframes, css } from 'styled-components'

import { Message } from '../../types/space'
import { useMediaChannel } from './MediaChannelProvider'
import { useMessageArchiver } from './MessageArchiverProvider'
import { FlexBox } from '../Box/Box'
import { ArchiveIcon } from '../Icons/ArchiveIcon'
import { Counter } from '../Counter/Counter'

const Content = styled(FlexBox)`
  * + * {
    margin-left: 8px;
  }
`

const CounterWrapper = styled.div`
  margin-right: 8px;
`

const ArchivedWrapper = styled.div`
  min-height: 16px;
  overflow: hidden;
`

const archivedContentKeyframes = keyframes`
  100% {
    transform: translateY(0px);
  }
`

const coverKeyframes = keyframes`
  0% {
    transform: translateY(-1px);
  }
  
  100% {
    transform: translateY(0);
  }
`

const archivedContentAnimationMixin = css`
  transform: translateY(20px);
  animation: ${archivedContentKeyframes} 0.5s ease-in-out forwards;

  svg > path:nth-child(3) {
    animation: ${coverKeyframes} 100ms ease-in-out forwards;
    animation-delay: 0.5s;
  }
`

type ArchivedContentProps = {
  runAnimation?: boolean
}

const ArchivedContent = styled(Content)<ArchivedContentProps>`
  ${({ runAnimation = false }) => runAnimation && archivedContentAnimationMixin}
`

type LabelProps = {
  color?: string
}

const Label = styled.span<LabelProps>`
  color: ${({ color = '#8c8c8c' }) => color};
  font-size: 14px;
  line-height: 16px;
`

const ActionButton = styled.div`
  color: #308575;
  font-size: 14px;
  line-height: 16px;
  cursor: pointer;

  :hover {
    text-decoration: underline;
  }
`

type Props = {
  message: Message
}

export const MessageArchiver = ({ message }: Props) => {
  const mediaChannel = useMediaChannel()
  const { archivableMessages, setIsMessageArchivable } = useMessageArchiver()
  const [timer, setTimer] = useState<number>()
  const isMessageArchivable = Boolean(archivableMessages[message.id!]?.isArchivable)
  const isMessageArchived = Boolean(archivableMessages[message.id!]?.isArchived)
  const shouldRunAnimationRef = useRef(!isMessageArchived)

  useEffect(() => {
    if (isMessageArchived || typeof timer === 'number') {
      return
    }

    if (isMessageArchivable) {
      setTimer(5)
    } else {
      setTimer(undefined)
    }
  }, [isMessageArchivable, isMessageArchived, timer])

  useEffect(() => {
    if (typeof timer === 'undefined' || timer <= 0) {
      return
    }

    const timerId = setTimeout(() => {
      setTimer((prevTimer) => {
        if (typeof prevTimer === 'undefined') {
          return prevTimer
        }

        return prevTimer - 1
      })
    }, 1000)

    return () => {
      clearTimeout(timerId)
    }
  }, [timer])

  useEffect(() => {
    const markAsArchived = async () => {
      await mediaChannel.storeChatMessage(message, 'archive')

      setTimer(undefined)
      setIsMessageArchivable(message.id, { isArchivable: false, isArchived: true })
    }

    if (timer === 0) {
      markAsArchived()
    }
  }, [timer, message, mediaChannel, setIsMessageArchivable])

  if (isMessageArchived) {
    return (
      <ArchivedWrapper>
        <ArchivedContent runAnimation={shouldRunAnimationRef.current} alignItems="center">
          <ArchiveIcon stroke="#308575" fill="#c8dfdb" />
          <Label color="#308575">Archived</Label>
        </ArchivedContent>
      </ArchivedWrapper>
    )
  }

  if (!isMessageArchivable) {
    return null
  }

  const handleCancelClick = () => {
    setTimer(undefined)
    setIsMessageArchivable(message.id, { isArchivable: false, isArchived: false })
  }

  return (
    <FlexBox justifyContent="space-between" alignItems="center">
      <FlexBox justifyContent="space-between" alignItems="center">
        <CounterWrapper>
          <Counter />
        </CounterWrapper>
        <Label>Archiving</Label>
      </FlexBox>
      <ActionButton onClick={handleCancelClick}>Cancel</ActionButton>
    </FlexBox>
  )
}
