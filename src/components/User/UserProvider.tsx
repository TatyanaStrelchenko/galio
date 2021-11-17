import React, { createContext, useContext, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { User } from '../../types/user'
import { setUsers } from '../../store/users'

type ContextValue = {
  user: User
}

const UserContext = createContext<ContextValue>({
  user: {} as User,
})

export const useUser = () => {
  const user = useContext(UserContext)

  return user
}

type Props = {
  children: React.ReactNode
  initialUser: User
}

export const UserProvider = ({ initialUser, children }: Props) => {
  const dispatch = useDispatch()
  const [user] = useState(initialUser)
  const value = { user }

  useEffect(() => {
    dispatch(setUsers([initialUser]))
  }, [initialUser, dispatch])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
