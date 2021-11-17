export const getVideoStream = async (): Promise<MediaStream> => {
  return navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      width: { min: 640, ideal: 1920 },
      height: { min: 400, ideal: 1080 },
    },
  })
}

export const getAudioStream = async (): Promise<MediaStream> => {
  return navigator.mediaDevices.getUserMedia({
    audio: { deviceId: 'default' },
    video: false,
  })
}

export const stopMediaStream = (mediaStream: MediaStream | null) => {
  if (!mediaStream) {
    return
  }

  mediaStream.getTracks().forEach((track) => {
    track.stop()
  })
}

export const isAudioTrackEnabled = (mediaStream: MediaStream | null) => {
  if (!mediaStream) {
    return false
  }

  const [track] = mediaStream.getAudioTracks()

  return Boolean(track?.enabled)
}

export const toggleTracks = (tracks: MediaStreamTrack[]) => {
  tracks.forEach((track) => {
    track.enabled = !track.enabled
  })
}
