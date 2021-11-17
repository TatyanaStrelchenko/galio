import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

import { isEnterPressed } from '../../services/dom'
import { Input as BaseInput } from '../Input/Input'
import { SendIcon } from '../Icons/SendIcon'
import { AttachmentIcon } from '../Icons/AttachmentIcon'
import { EmojiIcon } from '../Icons/EmojiIcon'

const Container = styled.div`
  position: relative;
`

const Input = styled(BaseInput)`
  padding: 4px 8px 4px 0;
  border: none;
  font-size: 14px;

  &::placeholder {
    color: #c6c6c6;
  }
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  border-top: 1px solid #dfdfde;
  padding: 0 4px;
`

const InputWrapper = styled.div`
  flex-grow: 1;
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 10px;
  color: #8c8c8c;
  font-size: 17px;
  cursor: pointer;
`

type Props = {
  onMessageSend: (content: string) => void
}

export const MessageInput = ({ onMessageSend }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [content, setContent] = useState('')

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleMessageSend = () => {
    if (content === '') {
      return
    }

    onMessageSend(content)
    setContent('')
  }

  const handleContentKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isEnterPressed(e)) {
      handleMessageSend()
    }
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const content = e.target.value

    setContent(content)
  }

  const handleIconClick = () => {
    handleMessageSend()

    inputRef.current?.focus()
  }

  return (
    <Container>
      <Wrapper>
        <IconWrapper>
          <AttachmentIcon />
        </IconWrapper>
        <InputWrapper>
          <Input
            inputRef={inputRef}
            placeholder="Type here..."
            value={content}
            onChange={handleContentChange}
            onKeyPress={handleContentKeyPress}
          />
        </InputWrapper>
        <IconWrapper>
          <EmojiIcon />
        </IconWrapper>
        <IconWrapper onClick={handleIconClick}>
          <SendIcon />
        </IconWrapper>
      </Wrapper>
    </Container>
  )
}
