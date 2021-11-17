import { combineReducers } from 'redux'

import textChannels from './textChannels/textChannels'
import users from './users'
import replies from './replies/replies'
import mediaChannels from './mediaChannels/mediaChannels'
import ui from './ui/ui'

export const rootReducer = combineReducers({
  textChannels,
  users,
  replies,
  mediaChannels,
  ui,
})
