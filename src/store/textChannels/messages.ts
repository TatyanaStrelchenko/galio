import keyBy from 'lodash/keyBy'

import { Action as BaseAction } from '../../types/state'
import { Channel, Message } from '../../types/space'
import { getStringId } from '../../services/channels'
import { NEW_CHAT_MESSAGE, NewChatMessageAction } from './actions'

export const SET_MESSAGES = 'textChannels/SET_MESSAGES'
export const ADD_MESSAGES = 'textChannels/ADD_MESSAGES'
export const ADD_REPLIES = 'textChannels/ADD_REPLIES'

type SetMessagesPayload = {
  channel: Channel
  messages: Message[]
}
type AddMessagesPayload = {
  channel: Channel
  messages: Message[]
}
type AddRepliesPayload = {
  channel: Channel
  message: Message
  replies: Message[]
}

export type SetMessagesAction = BaseAction<typeof SET_MESSAGES, SetMessagesPayload>
export type AddMessagesAction = BaseAction<typeof ADD_MESSAGES, AddMessagesPayload>
export type AddRepliesAction = BaseAction<typeof ADD_REPLIES, AddRepliesPayload>

type Action = SetMessagesAction | AddMessagesAction | AddRepliesAction | NewChatMessageAction

type StateValue = {
  messages: Record<number, Message>
}
type State = Record<string, StateValue>

const initialState: State = {}

export default function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case SET_MESSAGES:
      return setMessages(state, action)
    case ADD_MESSAGES:
      return addMessages(state, action)
    case NEW_CHAT_MESSAGE:
      return newChatMessage(state, action)
    case ADD_REPLIES:
      return addReplies(state, action)
    default:
      return state
  }
}

function setMessages(state: State, action: SetMessagesAction): State {
  const { channel, messages } = action.payload
  const channelId = getStringId(channel)
  const stateChannel = state[channelId]

  const messagesMap: Record<number, Message> = messages.reduce((acc, message) => {
    return {
      ...acc,
      [message.id as number]: message,
    }
  }, {})

  return {
    ...state,
    [channelId]: {
      ...stateChannel,
      messages: messagesMap,
    },
  }
}

function addMessages(state: State, action: AddMessagesAction) {
  const { channel, messages } = action.payload
  const channelId = getStringId(channel)
  const stateChannel = state[channelId]

  return {
    ...state,
    [channelId]: {
      ...stateChannel,
      messages: {
        ...stateChannel.messages,
        ...keyBy(messages, 'id'),
      },
    },
  }
}

function newChatMessage(state: State, action: NewChatMessageAction): State {
  const { message } = action.payload
  const channelId = getStringId(message.channel_id)
  const stateChannel = state[channelId]
  const messages = stateChannel.messages

  return {
    ...state,
    [channelId]: {
      ...stateChannel,
      messages: {
        ...messages,
        [message.id!]: message,
      },
    },
  }
}

// todo: remove?
function addReplies(state: State, action: AddRepliesAction): State {
  // const { channel, message, replies } = action.payload
  // const channelId = getStringId(channel)
  // const stateChannel = state[channelId]
  // const messages = stateChannel.messages || []

  debugger
  console.error('implement or remove this logic')

  return state

  // const nextMessages = [...messages]
  //
  // const startIndex = nextMessages.findIndex(({ id }) => message.id === id)
  //
  // if (startIndex === -1) {
  //   return state
  // }
  //
  // nextMessages.splice(startIndex, 1, ...replies)
  //
  // return {
  //   ...state,
  //   [channelId]: {
  //     ...stateChannel,
  //     messages: nextMessages,
  //   },
  // }
}
