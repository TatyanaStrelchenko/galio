import keyBy from 'lodash/keyBy'

import { Action as BaseAction, RootState } from '../types/state'
import { User } from '../types/user'

const SET_USERS = 'users/SET_USERS'

type SetUsersAction = BaseAction<typeof SET_USERS, User[]>
type Action = SetUsersAction

type State = Record<number, User>

const initialState: State = {}

export default function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case SET_USERS:
      return setUsersById(state, action)
    default:
      return state
  }
}

function setUsersById(state: State, action: SetUsersAction) {
  const users = action.payload

  return {
    ...state,
    ...keyBy(users, 'id'),
  }
}

export const setUsers = (users: User[]): SetUsersAction => ({
  type: SET_USERS,
  payload: users,
})

export const userByIdSelector = (state: RootState, userId: number) => {
  return state.users[userId]
}

export const usersByIdSelector = (state: RootState, userIds: number[]) => {
  return userIds.map((userId) => userByIdSelector(state, userId))
}
