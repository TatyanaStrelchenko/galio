import React, { createContext, useState, useContext } from 'react'

import { User } from '../../types/user'

type AuthContextValue = {
  user: User | null
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  setUser: () => {},
})

type Props = {
  children: React.ReactNode
}

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null)

  const value = { user, setUser }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
