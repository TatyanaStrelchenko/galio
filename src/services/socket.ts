export interface MySocket extends SocketIOClient.Socket {
  request: <T>(ev: string, data?: any) => Promise<T>
}

type ErrorProp = {
  error?: string
}

export const patchSocket = (socket: SocketIOClient.Socket) => {
  ;(socket as MySocket).request = <T>(ev: string, data: any = {}) => {
    return new Promise<T>((resolve, reject) => {
      socket.emit(ev, data, (result: T & ErrorProp) => {
        if (result.error) {
          reject(new Error(result.error))
        } else {
          resolve(result)
        }
      })
    })
  }

  return socket as MySocket
}
