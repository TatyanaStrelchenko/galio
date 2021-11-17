import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useLocation, useHistory } from 'react-router-dom'

import { authViaGoogle } from '../services/auth'
import { Spinner } from '../components/Spinner/Spinner'
import { Text } from '../components/Typography/Text'
import { useReferrer } from '../hooks/useReferrer'
import { useAuth } from '../components/Auth/AuthProvider'

const SpinnerWrapper = styled.div`
  text-align: center;
`

export const GoogleAuthScene = () => {
  const [error, setError] = useState(false)
  const location = useLocation()
  const { getAndErase } = useReferrer()
  const history = useHistory()
  const { setUser } = useAuth()

  useEffect(() => {
    const doAuth = async () => {
      const code = new URLSearchParams(location.search).get('code')

      if (!code) {
        setError(true)

        return
      }

      try {
        const user = await authViaGoogle(code)
        const referrer = getAndErase()

        setUser(user)

        history.replace(referrer ?? '/', { reloadUser: true })
      } catch (e) {
        setError(true)
      }
    }

    doAuth()
  }, [setUser, location, history, getAndErase])

  if (error) {
    return (
      <Text variant="danger" align="center">
        Filed to authenticate
      </Text>
    )
  }

  return (
    <SpinnerWrapper>
      <Spinner />
    </SpinnerWrapper>
  )
}
