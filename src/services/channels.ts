import { get, post, patch } from './api'
import { Space, Channel, Message } from '../types/space'

export const isTextChannel = (channel: Channel) => {
  return channel.type === 'TEXT_CHANNEL'
}

export const isSavedMessagesChannel = (channel: Channel) => {
  return channel.type === 'SAVED_MESSAGES_CHANNEL'
}

export const isVideoArchiveChannel = (channel: Channel) => {
  return channel.type === 'VIDEO_ARCHIVE_CHANNEL'
}

export const isTextChannelType = (channel: Channel) => {
  return isTextChannel(channel) || isSavedMessagesChannel(channel) || isVideoArchiveChannel(channel)
}

export const isVideoChannel = (channel: Channel) => {
  return channel.type === 'VIDEO_CHANNEL'
}

export const getStringId = (channel: Channel | number) => {
  const id = typeof channel === 'number' ? channel : channel.id

  return `channel_${id}`
}

export const createChannel = async (space: Space, channel: Partial<Channel>) => {
  const { data } = await post<Channel>(`/api/v1/spaces/${space.id}/channels`, channel)

  return data
}

type MessagesQuery = {
  from_id?: number
  depth?: number
}

export const getMessages = async (channel: Channel, query?: MessagesQuery): Promise<Message[]> => {
  const { data } = await get<Message[]>(`/api/v1/channels/${channel.id}/messages`, {
    params: query ?? {},
  })

  return data
}

export const getMessageReplies = async (channel: Channel, message: Message) => {
  const { data } = await get<Message[]>(`/api/v1/channels/${channel.id}/messages/${message.id}`)

  return data
}

export const sendMessage = async (channel: Channel, { content, parent_id }: Partial<Message>) => {
  const postData: Partial<Message> = { content }

  if (parent_id) {
    postData.parent_id = parent_id
  }

  const { data } = await post<Message>(`/api/v1/channels/${channel.id}/messages`, postData)

  return data
}

export const markChannelAsRead = async (channel: Channel) => {
  await patch(`/api/v1/channels/${channel.id}/messages`, {
    unread_messages_count: 0,
  })
}

export const findChannel = (
  spaces: Space[],
  spaceId?: string,
  channelId?: string
): Channel | null => {
  if (!(channelId && spaceId)) {
    return null
  }

  const numericSpaceId = Number(spaceId)
  const numericChannelId = Number(channelId)

  const space = spaces.find(({ id }) => id === numericSpaceId)
  const channel = space?.channels.find(({ id }) => id === numericChannelId)

  return channel || null
}

const linkRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi

export const findLinks = (content: string): string[] => {
  return content.match(linkRegex) ?? []
}
