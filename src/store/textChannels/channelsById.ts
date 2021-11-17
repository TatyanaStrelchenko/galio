import { Action as BaseAction } from '../../types/state'
import { Channel } from '../../types/space'
import { getStringId } from '../../services/channels'
import { NEW_CHAT_MESSAGE, NewChatMessageAction } from './actions'

type State = Record<
  string,
  {
    channel: Channel
  }
>

export const SET_TEXT_CHANNELS = 'textChannels/SET_TEXT_CHANNELS'
export const ADD_TEXT_CHANNEL = 'textChannels/ADD_TEXT_CHANNEL'
export const MARK_CHANNEL_AS_READ = 'textChannels/MARK_CHANNEL_AS_READ'

export type SetTextChannelsAction = BaseAction<typeof SET_TEXT_CHANNELS, Channel[]>
export type AddTextChannelAction = BaseAction<typeof ADD_TEXT_CHANNEL, Channel>
export type MarkChannelAsReadAction = BaseAction<typeof MARK_CHANNEL_AS_READ, Channel>

type Action =
  | SetTextChannelsAction
  | AddTextChannelAction
  | MarkChannelAsReadAction
  | NewChatMessageAction

const initialState: State = {}

export default function reducer(state = initialState, action: Action): State {
  switch (action.type) {
    case SET_TEXT_CHANNELS:
      return setTextChannels(state, action)
    case ADD_TEXT_CHANNEL:
      return addTextChannel(state, action)
    case NEW_CHAT_MESSAGE:
      return newChatMessage(state, action)
    case MARK_CHANNEL_AS_READ:
      return markChannelAsRead(state, action)
    default:
      return state
  }
}

function createChannelState(channel: Channel) {
  return {
    channel,
    messages: {},
    queuedMessages: [],
  }
}

function setTextChannels(state: State, action: SetTextChannelsAction): State {
  const channels = action.payload

  return channels.reduce(
    (acc, channel) => ({
      ...acc,
      [getStringId(channel)]: createChannelState(channel),
    }),
    {}
  )
}

function addTextChannel(state: State, action: AddTextChannelAction) {
  const channel = action.payload
  const channelId = getStringId(channel)

  return {
    ...state,
    [channelId]: createChannelState(channel),
  }
}

function newChatMessage(state: State, action: NewChatMessageAction): State {
  const { message, selectedChannelId } = action.payload
  const channelId = getStringId(message.channel_id)
  const stateChannel = state[channelId]

  if (selectedChannelId === channelId || !stateChannel) {
    return state
  }

  const unreadMessagesCount = stateChannel.channel.unread_messages_count || 0

  return {
    ...state,
    [channelId]: {
      ...stateChannel,
      channel: {
        ...stateChannel.channel,
        unread_messages_count: unreadMessagesCount + 1,
      },
    },
  }
}

function markChannelAsRead(state: State, action: MarkChannelAsReadAction): State {
  const channel = action.payload
  const channelId = getStringId(channel)
  const stateChannel = state[channelId]

  if (!stateChannel) {
    return state
  }

  return {
    ...state,
    [channelId]: {
      ...stateChannel,
      channel: {
        ...stateChannel.channel,
        unread_messages_count: 0,
      },
    },
  }
}
