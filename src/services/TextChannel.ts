import io from 'socket.io-client'

import { Message } from '../types/space'
import { ChannelInfo } from '../types/textChannel'
import { MySocket, patchSocket } from './socket'
import { createEventEmitter } from './eventEmitter'

export class TextChannel {
  eventEmitter = createEventEmitter()

  private socket: MySocket

  constructor(socket: SocketIOClient.Socket) {
    this.socket = patchSocket(socket)

    this.socket.on('error', (e: any) => {
      console.log('socket error', e)
    })

    this.socket.on('connect_error', (e: any) => {
      console.log('socket connect error', e)
    })

    this.subscribeToChatMessage()
    this.subscribeToChannelsInfo()
  }

  private subscribeToChatMessage() {
    this.socket.on('chat_message', (message: Message) => {
      this.eventEmitter.dispatch('chat:message', message)
    })
  }

  private subscribeToChannelsInfo() {
    this.socket.on('channels_info', (channelsInfo: ChannelInfo[]) => {
      this.eventEmitter.dispatch('channels:info', channelsInfo)
    })
  }
}

// todo: make it global
export const createTextChannel = () => {
  const uri = process.env.REACT_APP_CHAT_BASE_URL || 'http://localhost:3003'

  return new TextChannel(
    io(uri, {
      path: '/api/v1/',
    })
  )
}
