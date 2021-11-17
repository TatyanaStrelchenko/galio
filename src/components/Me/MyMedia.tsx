import { useUser } from '../User/UserProvider'
import { useMyMediaStream } from './MyMediaStreamProvier'
import { SpeakerMedia } from '../Speaker/SpeakerMedia'

type MyMediaProps = {
  className?: string
}

export const MyMedia = ({ className }: MyMediaProps) => {
  const { videoStream, screenStream } = useMyMediaStream()
  const { user } = useUser()

  return (
    <SpeakerMedia className={className} user={user} mediaStream={screenStream || videoStream} />
  )
}
