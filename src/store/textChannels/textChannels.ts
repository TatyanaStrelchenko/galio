import { combineReducers, Dispatch } from 'redux'

import { Action as BaseAction, GetState, RootState } from '../../types/state'
import { Channel, Message } from '../../types/space'
import { reduceReducers } from '../../services/store'
import { getStringId, isSavedMessagesChannel } from '../../services/channels'
import { NEW_CHAT_MESSAGE, NewChatMessageAction } from './actions'
import channelByIdReducer, {
  ADD_TEXT_CHANNEL,
  AddTextChannelAction,
  MARK_CHANNEL_AS_READ,
  MarkChannelAsReadAction,
  SET_TEXT_CHANNELS,
  SetTextChannelsAction,
} from './channelsById'
import messagesReducer, {
  ADD_MESSAGES,
  ADD_REPLIES,
  AddMessagesAction,
  AddRepliesAction,
  SET_MESSAGES,
  SetMessagesAction,
} from './messages'
import queuedMessagesReducer, {
  ADD_QUEUED_MESSAGE,
  AddQueuedMessageAction,
  REMOVE_QUEUED_MESSAGE,
  RemoveQueuedMessageAction,
} from './queuedMessages'

export const SET_SELECTED_CHANNEL_ID = 'textChannels/SET_SELECTED_CHANNEL_ID'

type SetSelectedChannelIdAction = BaseAction<typeof SET_SELECTED_CHANNEL_ID, Channel | null>

function selectedChannelIdReducer(state = 0, action: SetSelectedChannelIdAction) {
  switch (action.type) {
    case SET_SELECTED_CHANNEL_ID:
      return action.payload ? getStringId(action.payload) : 0
    default:
      return state
  }
}

export default combineReducers({
  byId: reduceReducers({}, channelByIdReducer, messagesReducer, queuedMessagesReducer),
  selectedChannelId: selectedChannelIdReducer,
})

export const setTextChannels = (textChannels: Channel[]): SetTextChannelsAction => ({
  type: SET_TEXT_CHANNELS,
  payload: textChannels,
})

export const addTextChannel = (textChannel: Channel): AddTextChannelAction => ({
  type: ADD_TEXT_CHANNEL,
  payload: textChannel,
})

export const setMessages = (channel: Channel, messages: Message[]): SetMessagesAction => ({
  type: SET_MESSAGES,
  payload: { channel, messages },
})

export const addMessages = (channel: Channel, messages: Message[]): AddMessagesAction => ({
  type: ADD_MESSAGES,
  payload: { channel, messages },
})

export const addQueuedMessage = (channel: Channel, message: Message): AddQueuedMessageAction => ({
  type: ADD_QUEUED_MESSAGE,
  payload: { channel, message },
})

export const removeQueuedMessage = (
  channel: Channel,
  message: Message
): RemoveQueuedMessageAction => ({
  type: REMOVE_QUEUED_MESSAGE,
  payload: { channel, message },
})

export const newChatMessage = (message: Message, removeQueuedMessage = true) => (
  dispatch: Dispatch<NewChatMessageAction>,
  getState: GetState
) => {
  const selectedChannelId = selectedChannelIdSelector(getState())

  dispatch({
    type: NEW_CHAT_MESSAGE,
    payload: { message, selectedChannelId, removeQueuedMessage },
  })
}

export const setSelectedChannel = (channel: Channel | null): SetSelectedChannelIdAction => ({
  type: SET_SELECTED_CHANNEL_ID,
  payload: channel,
})

export const markChannelAsRead = (channel: Channel): MarkChannelAsReadAction => ({
  type: MARK_CHANNEL_AS_READ,
  payload: channel,
})

export const addReplies = (
  channel: Channel,
  message: Message,
  replies: Message[]
): AddRepliesAction => ({
  type: ADD_REPLIES,
  payload: { channel, message, replies },
})

export const selectedChannelIdSelector = (state: RootState) => {
  return state.textChannels.selectedChannelId
}

const selectedChannelSelector = (state: RootState) => {
  const { byId, selectedChannelId } = state.textChannels

  return byId[selectedChannelId]
}

export const textChannelSelector = (state: RootState) => {
  const selectedChannel = selectedChannelSelector(state)

  return selectedChannel?.channel || null
}

export const savedMessagesChannelSelector = (state: RootState): Channel | null => {
  const textChannels = textChannelsSelector(state)

  return textChannels.find(isSavedMessagesChannel) || null
}

export const textChannelsSelector = (state: RootState): Channel[] => {
  return Object.values(state.textChannels.byId).map(({ channel }) => channel)
}

export const messagesSelector = (state: RootState) => {
  const channel = selectedChannelSelector(state)

  if (!channel) {
    return []
  }

  return channel.messages
}

export const queuedMessagesSelector = (state: RootState) => {
  const channel = selectedChannelSelector(state)

  if (!channel) {
    return []
  }

  return channel.queuedMessages
}

type MessageTree = Message & {
  children: MessageTree[]
}

export const messageTreeSelector = (state: RootState): MessageTree[] => {
  const messages = messagesSelector(state)
  const repliesByMessageId = state.replies.byMessageId
  const allMessages = Object.values(messages)

  const tree: MessageTree[] = []
  const treeMap: Record<number, MessageTree> = {}

  allMessages.forEach((message) => {
    treeMap[message.id as number] = {
      ...message,
      children: [],
    }
  })

  allMessages.forEach((message) => {
    if (message.parent_id) {
      treeMap[message.parent_id].children.push(treeMap[message.id as number])
    } else {
      tree.push(treeMap[message.id as number])
    }

    const repliesState = repliesByMessageId[message.id as number] || {}

    if (repliesState.showReplies) {
      repliesState.replies?.forEach((reply) => {
        if (!treeMap[reply.id!]) {
          treeMap[reply.id as number] = {
            ...reply,
            children: [],
          }
        }

        treeMap[reply.parent_id!].children.push(treeMap[reply.id as number])
      })
    }
  })

  return tree
}
