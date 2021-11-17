import { combineReducers } from 'redux'

import { Message } from '../../types/space'
import { RootState } from '../../types/state'
import { reduceReducers } from '../../services/store'
import byMessageIdReducer, { SET_REPLIES, SetRepliesAction } from './byMessageId'
import showRepliesReducer, { TOGGLE_SHOW_REPLIES, ToggleShowRepliesAction } from './showReplies'

export default combineReducers({
  byMessageId: reduceReducers({}, byMessageIdReducer, showRepliesReducer),
})

export const setReplies = (rootMessage: Message, replies: Message[]): SetRepliesAction => ({
  type: SET_REPLIES,
  payload: { rootMessage, replies },
})

export const toggleShowReplies = (rootMessage: Message): ToggleShowRepliesAction => ({
  type: TOGGLE_SHOW_REPLIES,
  payload: { rootMessage },
})

export const repliesByMessageIdSelector = (state: RootState, rootMessageId: number | null) => {
  if (!rootMessageId) {
    return []
  }

  return state.replies.byMessageId[rootMessageId]?.replies || []
}

export const showRepliesSelector = (state: RootState, rootMessageId: number | null) => {
  if (!rootMessageId) {
    return false
  }

  return Boolean(state.replies.byMessageId[rootMessageId]?.showReplies)
}
