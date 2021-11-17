import { Action as BaseAction } from '../../types/state'
import { Message } from '../../types/space'

export const SET_REPLIES = 'replies/SET_REPLIES'

type SetRepliesPayload = {
  rootMessage: Message
  replies: Message[]
}
export type SetRepliesAction = BaseAction<typeof SET_REPLIES, SetRepliesPayload>

type Action = SetRepliesAction

type StateValue = {
  replies: Message[]
  showReplies: boolean
}
type State = Record<number, StateValue>

const initialState: State = {}

export default function reducer(state = initialState, action: Action): State {
  switch (action.type) {
    case SET_REPLIES:
      return setReplies(state, action)
    default:
      return state
  }
}

function setReplies(state: State, action: SetRepliesAction) {
  const { rootMessage, replies } = action.payload

  if (!rootMessage.id) {
    return state
  }

  const stateReplies = state[rootMessage.id]

  return {
    ...state,
    [rootMessage.id]: {
      ...stateReplies,
      replies: replies.filter((reply) => reply.id !== rootMessage.id),
      showReplies: true,
    },
  }
}
