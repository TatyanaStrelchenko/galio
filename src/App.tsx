import React, { useEffect, useState } from 'react'

import './App.css'

import { bootstrap } from './services/bootstrap'
import { Spinner } from './components/Spinner/Spinner'
import { PrivateApp } from './PrivateApp'
import { PublicApp } from './PublicApp'
import { useAuth } from './components/Auth/AuthProvider'

function App() {
  const { user, setUser } = useAuth()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const doBootstrap = async () => {
      setLoading(true)

      const { user } = await bootstrap()

      setUser(user)
      setLoading(false)
    }

    doBootstrap()
  }, [setUser])

  if (loading) {
    return <Spinner align="center" />
  }

  if (!user) {
    return <PublicApp />
  }

  return <PrivateApp user={user} />
}

export default App
