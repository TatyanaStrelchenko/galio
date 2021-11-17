import { Action as BaseAction } from '../../types/state'
import { Message } from '../../types/space'

export const TOGGLE_SHOW_REPLIES = 'replies/TOGGLE_SHOW_REPLIES'

type ToggleShowRepliesPayload = {
  rootMessage: Message
}
export type ToggleShowRepliesAction = BaseAction<
  typeof TOGGLE_SHOW_REPLIES,
  ToggleShowRepliesPayload
>

type Action = ToggleShowRepliesAction

type StateValue = {
  showReplies: boolean
}
type State = Record<number, StateValue>

const initialState: State = {}

export default function reducer(state = initialState, action: Action): State {
  switch (action.type) {
    case TOGGLE_SHOW_REPLIES:
      return toggleShowReplies(state, action)
    default:
      return state
  }
}

function toggleShowReplies(state: State, action: ToggleShowRepliesAction) {
  const { rootMessage } = action.payload

  if (!rootMessage.id) {
    return state
  }

  const stateReplies = state[rootMessage.id]

  return {
    ...state,
    [rootMessage.id]: {
      ...stateReplies,
      showReplies: !stateReplies.showReplies,
    },
  }
}
