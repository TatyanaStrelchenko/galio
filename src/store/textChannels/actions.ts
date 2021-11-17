import { Action } from '../../types/state'
import { Message } from '../../types/space'

export const NEW_CHAT_MESSAGE = 'textChannels/NEW_CHAT_MESSAGE'

export type NewChatMessageAction = Action<
  typeof NEW_CHAT_MESSAGE,
  {
    message: Message
    selectedChannelId: string
    removeQueuedMessage: boolean
  }
>
