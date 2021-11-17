export type Producer = {
  id: string
  kind: 'audio' | 'video'
}

export type Peer = {
  userId: number
  producers?: Producer[]
  muted?: boolean
}
