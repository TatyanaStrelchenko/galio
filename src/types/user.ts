export type User = {
  id: number
  email: string
  name: string
  picture: string
}

export type ParticipantInfo = {
  userId: number
  cameraEnabled: boolean
  micEnabled: boolean
}

export type Participant = User & ParticipantInfo
