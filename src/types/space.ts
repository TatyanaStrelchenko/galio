import { User } from './user'

export type ChannelType =
  | 'VIDEO_CHANNEL'
  | 'TEXT_CHANNEL'
  | 'SAVED_MESSAGES_CHANNEL'
  | 'VIDEO_ARCHIVE_CHANNEL'

export type Channel = {
  id: number
  hash_id: string
  name: string
  type: ChannelType
  unread_messages_count: number
  archived: boolean
}

export type VideoChannel = {
  name: string
  hash_id: string
  video_host: boolean
  created_at?: string
  isExternal?: boolean
}

export type VideoChannelInfo = VideoChannel & {
  users: User[]
  start_time: string
}

export type VideoChannelJoinResult = {
  startTime: string
}

export type Space = {
  id: number
  name: string
  picture: string | null
  channels: Channel[]
  video_channels: VideoChannel[]
}

export type MessageAttachment = {
  contentType: string
  title: string
  url: string
  description?: string
  logo_url?: string
}

export type Message = {
  id: number | null
  depth: number
  channel_id: number
  user_id: number
  user: Omit<User, 'email'>
  content: string
  created_at: string
  attachments: MessageAttachment[]
  space_id?: number
  updated_at?: string
  replies_count?: number
  parent_id?: number
  root_replies_count?: number
  isSaved?: boolean
}

export type MessageTree = Message & {
  children: MessageTree[]
}

export type VideoChatMessageMeta = {
  messageId: string
  attachments: MessageAttachment[]
}
