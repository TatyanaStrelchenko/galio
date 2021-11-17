import React, { useEffect, useState } from 'react'
import { DateTime, DurationObject } from 'luxon'

import { Text, Props as TextProps } from '../Typography/Text'

type Props = TextProps & {
  startTime: string
  className?: string
}

export const CallTime = ({ startTime, className, ...props }: Props) => {
  const [duration, setDuration] = useState<DurationObject>()

  useEffect(() => {
    if (!startTime) {
      return
    }

    const meetingStartTime = DateTime.fromISO(startTime).startOf('second')

    const intervalId = setInterval(() => {
      const now = DateTime.now().startOf('second')
      const duration = now.diff(meetingStartTime, ['hours', 'minutes', 'seconds'])

      setDuration(duration.toObject())
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [startTime])

  const hours = duration?.hours?.toString().padStart(2, '0') || '00'
  const minutes = duration?.minutes?.toString().padStart(2, '0') || '00'
  const seconds = duration?.seconds?.toString().padStart(2, '0') || '00'

  return (
    <Text className={className} bold as="span" size="normal" {...props}>
      {hours}:{minutes}:{seconds}
    </Text>
  )
}
