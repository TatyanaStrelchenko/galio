import { Action as BaseAction } from 'redux'

import { Channel, Message } from './space'
import { User } from './user'

export type Action<T, P> = BaseAction<T> & {
  payload: P
}

export type Reducer<S, A> = (state: S, action: A) => S
export type Dispatch<T, R> = (action: T) => R

export type TextChannelsByIdState = {
  channel: Channel
  messages: Record<number, Message>
  queuedMessages: []
}
export type TextChannelsState = {
  byId: Record<string, TextChannelsByIdState>
  selectedChannelId: string
}

export type MediaChannelsByIdState = {
  participantsCount: number
}

export type MediaChannelsState = {
  byId: Record<string, MediaChannelsByIdState>
}

export type UsersState = Record<number, User>

export type RepliesByMessageIdState = {
  replies: Message[]
  showReplies: boolean
}
export type RepliesState = {
  byMessageId: Record<number, RepliesByMessageIdState>
}

export type UiState = {
  showSidebar: boolean
  accordions: {
    isVideoChannelsOpen: boolean
    isTextChannelsOpen: boolean
  }
}

export type RootState = {
  textChannels: TextChannelsState
  users: UsersState
  replies: RepliesState
  mediaChannels: MediaChannelsState
  ui: UiState
}

export type GetState = () => RootState
