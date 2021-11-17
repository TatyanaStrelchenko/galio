import io from 'socket.io-client'
import { Device, types } from 'mediasoup-client'

import { User } from '../types/user'
import { Peer } from '../types/peer'
import { Message, VideoChannelJoinResult, VideoChatMessageMeta } from '../types/space'
import { MySocket, patchSocket } from './socket'
import { createEventEmitter } from './eventEmitter'

type UserDataEvent = {
  userId: number
}

type VideoChatMessage = {
  id: string
  content: string
  createdAt: string
  userId: number
}

const defaultVideoEncodings = [
  {
    rid: 'r0',
    maxBitrate: 100000,
    //scaleResolutionDownBy: 10.0,
    scalabilityMode: 'S1T3',
  },
  {
    rid: 'r1',
    maxBitrate: 300000,
    scalabilityMode: 'S1T3',
  },
  {
    rid: 'r2',
    maxBitrate: 900000,
    scalabilityMode: 'S1T3',
  },
]

export class MediaChannel {
  eventEmitter = createEventEmitter()

  private socket: MySocket

  private device: types.Device | null = null

  private consumers: Map<string, types.Consumer> = new Map<string, types.Consumer>()
  private producers: Map<string, types.Producer> = new Map<string, types.Producer>()

  private producerTransport: types.Transport | null = null
  private consumerTransport: types.Transport | null = null

  constructor(socket: SocketIOClient.Socket) {
    this.socket = patchSocket(socket)

    const handleError = (error: Error) => {
      this.eventEmitter.dispatch('socket:error', error)
      // this.socket.disconnect()
    }

    this.socket.on('connect_error', handleError)
    this.socket.on('error', handleError)

    this.socket.on('disconnect', (data: any) => {
      console.log('socket disconnect', data)
    })
  }

  async previewRoom() {
    // only for preview room - should unsubscribe
    this.socket.on('participants_info', (peers: Peer[]) => {
      this.eventEmitter.dispatch('participants:info', peers)
    })
    this.socket.on('producer_closed', (peer: Peer) => {
      this.eventEmitter.dispatch('participants:camera:off', peer)
    })

    // do not unsub
    this.socket.on('user_muted', (peer: Peer) => {
      this.eventEmitter.dispatch('participant:mic:toggle', peer)
      console.log('User Muted', peer)
    })
    this.socket.on('user_resumed', (peer: Peer) => {
      this.eventEmitter.dispatch('participant:mic:toggle', peer)
    })
    this.socket.on('user_exited', ({ userId }: Peer) => {
      this.eventEmitter.dispatch('user:exited', userId)
    })
    this.socket.on('user_joined', (user: User) => {
      this.eventEmitter.dispatch('user:joined', user)
    })

    this.socket.emit('preview_room')
  }

  async join(): Promise<VideoChannelJoinResult> {
    try {
      this.subscribeToSockets()

      const joinResult: VideoChannelJoinResult = await this.socket.request('join')

      const rtpCapabilities = await this.socket.request<types.RtpCapabilities>(
        'get_rtp_capabilities'
      )
      console.log('rtpCapabilities', rtpCapabilities)

      const device = await this.loadDevice(rtpCapabilities)

      // todo move this hack
      // {
      //   const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      //   const audioTrack = stream.getAudioTracks()[0];
      //
      //   audioTrack.enabled = false;
      //
      //   setTimeout(() => audioTrack.stop(), 120000);
      // }

      console.log('init transports')

      await this.initProducerTransport(device)
      await this.initConsumerTransport(device)

      console.log('transports inited SUCCESS')

      this.socket.emit('get_producers')

      console.log('Get producers requested')

      return joinResult
    } catch (e) {
      this.disconnect(false)
      console.log('Failed to join to the media channel', e)

      throw e
    }
  }

  async disconnect(online: boolean = true) {
    if (online) {
      // todo: check if producers closes successful
      // await Promise.all(
      //   Array
      //     .from(this.producers.values())
      //     .map((producer) => {
      //       return this.closeVideoProducer(producer.id)
      //     })
      // )

      await this.exitChannel()
    }

    this.consumerTransport?.close()
    this.producerTransport?.close()

    this.socket.off('disconnect')
    this.socket.off('new_producers')
    this.socket.off('consumer_closed')
    this.socket.off('error')
    this.socket.off('connect_error')
    this.socket.off('current_speaker')
    this.socket.off('user_exited')

    // todo: refactor
    if (online) {
      this.socket.disconnect()
    }

    console.log('exited from room')
  }

  private async exitChannel() {
    try {
      this.socket.request('exit_channel').catch((e) => {
        console.log('Exit Channel Failed', e)
      })

      console.log('Successfully exited')
    } catch (e) {
      console.log('Failed to exit from channel socket', e)
    }
  }

  private subscribeToSockets() {
    this.socket.on('new_producers', async (peers: Peer[]) => {
      this.eventEmitter.dispatch('producers:new', peers)

      for (let peer of peers) {
        for (let producer of peer.producers || []) {
          await this.consume(producer.id, peer.userId)
        }
      }
    })

    this.socket.on('consumer_closed', ({ consumerId }: { consumerId: string }) => {
      console.log('closing consumer:', consumerId)

      this.removeConsumer(consumerId)
    })

    this.socket.on('disconnect', () => {
      console.log('!!!DISCONECT')
      this.disconnect(false)
    })

    this.socket.on('current_speaker', ({ userId }: UserDataEvent) => {
      if (!userId) {
        // todo: remove when the issue with undefined userId will be fixed
        return
      }

      this.eventEmitter.dispatch('current:speaker:change', userId)
    })

    this.socket.on('user_exited', ({ userId }: UserDataEvent) => {
      this.eventEmitter.dispatch('user:exited', userId)
    })

    this.socket.on('video_chat_message', (message: VideoChatMessage) => {
      this.eventEmitter.dispatch('video:chat:message', {
        id: message.id,
        content: message.content,
        created_at: message.createdAt,
        user_id: message.userId,
        link: [],
      })
    })

    this.socket.on('video_chat_message_metadata', (messageMeta: VideoChatMessageMeta) => {
      this.eventEmitter.dispatch('video:chat:message:meta', messageMeta)
    })
  }

  async consume(producerId: string, userId: number) {
    const { consumer, stream, kind } = await this.getConsumeStream(producerId)

    await this.socket.request('resume_consumer', {
      consumerId: consumer.id,
    })

    this.consumers.set(consumer.id, consumer)

    const removeConsumer = () => {
      this.removeConsumer(consumer.id)
    }

    consumer.on('trackended', removeConsumer)
    consumer.on('transportclose', removeConsumer)

    this.eventEmitter.dispatch('consumer:new', {
      consumerId: consumer.id,
      stream,
      kind,
      userId,
    })
  }

  async getConsumeStream(producerId: string) {
    if (!this.device) {
      throw new Error('device no loaded')
    }

    if (!this.consumerTransport) {
      throw new Error('consumer transport is not initialized')
    }

    const { rtpCapabilities } = this.device
    const { id, kind, rtpParameters } = await this.socket.request('consume', {
      rtpCapabilities,
      consumerTransportId: this.consumerTransport.id, // might be
      producerId,
    })

    const consumer = await this.consumerTransport.consume({
      id,
      producerId,
      kind,
      rtpParameters,
      // @ts-ignore
      codecOptions: {},
    })

    const stream = new MediaStream() // new MediaStream([consumer.track])
    stream.addTrack(consumer.track)

    return {
      consumer,
      stream,
      kind,
    }
  }

  removeConsumer(consumerId: string) {
    // stop tracks!

    this.eventEmitter.dispatch('consumer:remove', {
      consumerId,
    })

    this.consumers.delete(consumerId)
  }

  async loadDevice(routerRtpCapabilities: types.RtpCapabilities) {
    try {
      const device = new Device()
      console.log('my device', device)

      await device.load({ routerRtpCapabilities })

      console.log('my device after load', device)

      this.device = device

      return device
    } catch (e) {
      console.log('DEVICE FAILURE', e)

      throw e
    }
  }

  async initProducerTransport(device: Device) {
    const data = await this.socket.request<types.TransportOptions>('create_webrtc_transport', {
      forceTcp: false,
      rtpCapabilities: device.rtpCapabilities,
    })

    this.producerTransport = device.createSendTransport(data)

    console.log('producer transport', data)

    this.producerTransport.on(
      'connect',
      async ({ dtlsParameters }: { dtlsParameters: types.DtlsParameters }, callback, errback) => {
        try {
          const result = await this.socket.request('connect_transport', {
            dtlsParameters,
            transport_id: data.id,
          })

          console.log('On Producer Connect', result)

          callback(result)
        } catch (e) {
          errback(e)
        }
      }
    )

    this.producerTransport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
      try {
        const { producerId } = await this.socket.request('produce', {
          producerTransportId: this.producerTransport?.id,
          kind,
          rtpParameters,
        })

        console.log('On Producer Produce', producerId)

        callback({ id: producerId })
      } catch (err) {
        errback(err)
      }
    })

    this.producerTransport.on('connectionstatechange', (state) => {
      switch (state) {
        case 'connecting':
          break

        case 'connected':
          //localVideo.srcObject = stream
          break

        case 'failed':
          this.producerTransport?.close()
          break

        default:
          break
      }
    })
  }

  async initConsumerTransport(device: Device) {
    const data = await this.socket.request<types.TransportOptions>('create_webrtc_transport', {
      forceTcp: false,
    })

    this.consumerTransport = device.createRecvTransport(data)

    console.log('consumer transport', data)

    this.consumerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      try {
        const result = await this.socket.request('connect_transport', {
          transport_id: this.consumerTransport?.id,
          dtlsParameters,
        })

        console.log('On Consumer Connect', result)

        callback(result)
      } catch (e) {
        errback(e)
      }
    })

    this.consumerTransport.on('connectionstatechange', (state) => {
      switch (state) {
        case 'connecting':
          break
        case 'connected':
          //remoteVideo.srcObject = await stream;
          //await socket.request('resume');
          break

        case 'failed':
          this.consumerTransport?.close()
          break

        default:
          break
      }
    })
  }

  async produceAudio(stream: MediaStream) {
    if (!this.producerTransport) {
      throw new Error('Producer transport is not initialized')
    }

    console.log('START producing audio !', stream)

    const track = stream.getAudioTracks()[0]
    const producer = await this.producerTransport.produce({ track })

    console.log('audio producer', producer)

    this.producers.set(producer.id, producer)

    producer.on('trackended', () => {
      console.log('on audio track ended')
      this.closeProducer(producer.id)
    })

    producer.on('transportclose', () => {
      console.log('on audio transport close')
      this.producers.delete(producer.id)
    })

    producer.on('close', () => {
      console.log('on audio close')
      this.producers.delete(producer.id)
    })

    return producer
  }

  async produceVideo(stream: MediaStream) {
    if (!this.producerTransport) {
      throw new Error('Producer transport is not initialized')
    }

    if (!this.device?.canProduce('video')) {
      throw new Error('Cannot produce video')
    }

    console.log('START producing video !', stream)

    const track = stream.getVideoTracks()[0]
    const producer = await this.producerTransport.produce({
      track,
      encodings: defaultVideoEncodings,
      codecOptions: { videoGoogleStartBitrate: 1000 },
    })

    console.log('video producer', producer)

    this.producers.set(producer.id, producer)

    producer.on('trackended', () => {
      console.log('on video track ended')
      this.closeProducer(producer.id)
    })

    producer.on('transportclose', () => {
      console.log('on video transport close')
      this.producers.delete(producer.id)
    })

    producer.on('close', () => {
      console.log('on video close')
      this.producers.delete(producer.id)
    })

    return producer
  }

  async closeProducer(producerId: string | undefined) {
    if (!producerId) {
      return
    }

    console.log('CLOSE producer !', producerId)

    this.socket.emit('producer_closed', {
      producerId,
    })

    this.producers.get(producerId)?.close()
    this.producers.delete(producerId)
  }

  async pauseMic(producer: types.Producer) {
    await this.socket.request('mute_audio_producer')

    producer.pause()
  }

  async resumeMic(producer: types.Producer) {
    await this.socket.request('resume_audio_producer')

    producer.resume()
  }

  emitCurrentSpeakerChange() {
    this.socket.emit('set_current_speaker')
  }

  emitVideoChatMessage(content: string) {
    this.socket.emit('video_chat_message', {
      content,
    })
  }

  async storeChatMessage(message: Message, action: 'save' | 'archive' = 'save') {
    await this.socket.request('store_chat_message', {
      action,
      messageId: message.id,
    })
  }
}

export const createMediaChannel = (channelId: number | string) => {
  const uri = process.env.REACT_APP_MEDIA_BASE_URL || 'http://localhost:3002'

  return new MediaChannel(
    io(uri, {
      path: '/api/v1/media',
      query: { channel_id: channelId },
    })
  )
}
