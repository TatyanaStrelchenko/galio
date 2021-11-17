import React from 'react'

import { isTextChannelType } from '../services/channels'
import { useUser } from '../components/User/UserProvider'
import { useSpaces } from '../components/Spaces/SpacesProvider'
import { TextChannel } from '../components/TextChannel/TextChannel'

export const TextChannelScene = () => {
  const { user } = useUser()
  const { selectedTextChannel } = useSpaces()

  if (!(selectedTextChannel && isTextChannelType(selectedTextChannel) && user)) {
    return null
  }

  return <TextChannel />
}
