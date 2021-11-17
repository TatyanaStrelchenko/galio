import { User } from '../../types/user'
import { Video } from '../Media/Media'
import { Avatar } from './Avatar'

type Props = {
  user: User | null
  className?: string
  mediaStream?: MediaStream | null
}

export const SpeakerMedia = ({ user, className, mediaStream }: Props) => {
  if (!mediaStream) {
    return <Avatar className={className} user={user} />
  }

  return (
    <div className="speaker-media-wrapper">
      <Video className={className} kind="video" stream={mediaStream} />
    </div>
  )
}
