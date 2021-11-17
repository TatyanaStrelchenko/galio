import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Channel, Message as MessageType, MessageTree } from '../../types/space'
import { getMessages, getMessageReplies } from '../../services/channels'
import { addMessages, messageTreeSelector } from '../../store/textChannels/textChannels'
import { Spinner } from '../Spinner/Spinner'
import { setReplies } from '../../store/replies/replies'
import { TreeMessage } from './TreeMessage'

type Props = {
  loading: boolean
  channel: Channel
  queuedMessages: MessageType[]
}

const getMessageKey = (message: MessageType) => {
  return new Date(message.created_at).getTime()
}

export const Messages = ({ channel, loading, queuedMessages }: Props) => {
  const dispatch = useDispatch()
  const messagesTree = useSelector(messageTreeSelector)

  if (loading) {
    return <Spinner size="small" align="center" />
  }

  if (!loading && messagesTree.length === 0) {
    return <div>You don't have any messages yet</div>
  }

  const handleLoadMoreReplies = async (message: MessageType) => {
    const replies = await getMessageReplies(channel, message)

    dispatch(setReplies(message, replies))
  }

  const handleLoadMoreRootReplies = async (message: MessageTree) => {
    const lastReply = message.children[message.children.length - 1]
    const replies = await getMessages(channel, {
      from_id: lastReply.id!,
      depth: 1,
    })

    dispatch(addMessages(channel, replies))
  }

  return (
    <Fragment>
      {messagesTree.map((message, index) => (
        <TreeMessage
          key={message.id}
          message={message}
          previousMessage={messagesTree[index - 1]}
          onLoadMoreReplies={handleLoadMoreReplies}
          onLoadMoreRootReplies={handleLoadMoreRootReplies}
        />
      ))}
      {queuedMessages.map((message, index) => (
        <TreeMessage key={getMessageKey(message)} queued message={{ ...message, children: [] }} />
      ))}
    </Fragment>
  )
}
