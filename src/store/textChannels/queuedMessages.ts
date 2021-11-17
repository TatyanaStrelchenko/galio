import { Action as BaseAction } from '../../types/state'
import { Channel, Message } from '../../types/space'
import { getStringId } from '../../services/channels'
import { NEW_CHAT_MESSAGE, NewChatMessageAction } from './actions'

export const ADD_QUEUED_MESSAGE = 'textChannels/ADD_QUEUED_MESSAGE'
export const REMOVE_QUEUED_MESSAGE = 'textChannels/REMOVE_QUEUED_MESSAGE'

type MessagePayload = {
  channel: Channel
  message: Message
}

export type AddQueuedMessageAction = BaseAction<typeof ADD_QUEUED_MESSAGE, MessagePayload>
export type RemoveQueuedMessageAction = BaseAction<typeof REMOVE_QUEUED_MESSAGE, MessagePayload>

type Action = AddQueuedMessageAction | NewChatMessageAction | RemoveQueuedMessageAction

type State = Record<
  string,
  {
    queuedMessages: Message[]
  }
>

const initialState: State = {}

export default function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case ADD_QUEUED_MESSAGE:
      return addQueuedMessage(state, action)
    case REMOVE_QUEUED_MESSAGE:
      return removeQueuedMessage(state, action)
    case NEW_CHAT_MESSAGE:
      return newChatMessage(state, action)
    default:
      return state
  }
}

function addQueuedMessage(state: State, action: AddQueuedMessageAction): State {
  const { channel, message } = action.payload
  const channelId = getStringId(channel)
  const stateChannel = state[channelId]
  const queuedMessages = stateChannel.queuedMessages || []

  return {
    ...state,
    [channelId]: {
      ...stateChannel,
      queuedMessages: [...queuedMessages, message],
    },
  }
}

function removeQueuedMessage(state: State, action: RemoveQueuedMessageAction) {
  const { channel, message } = action.payload
  const channelId = getStringId(channel)
  const stateChannel = state[channelId]
  const queuedMessages = stateChannel.queuedMessages || []

  const index = queuedMessages.indexOf(message)

  if (index === -1) {
    return state
  }

  queuedMessages.splice(index, 1)

  return {
    ...state,
    [channelId]: {
      ...stateChannel,
      queuedMessages,
    },
  }
}

function newChatMessage(state: State, action: NewChatMessageAction): State {
  const { message, removeQueuedMessage } = action.payload
  const channelId = getStringId(message.channel_id)
  const stateChannel = state[channelId]
  let queuedMessages = stateChannel.queuedMessages || []

  if (removeQueuedMessage) {
    queuedMessages = [...queuedMessages]
    queuedMessages.shift()
  }

  return {
    ...state,
    [channelId]: {
      ...stateChannel,
      queuedMessages,
    },
  }
}
