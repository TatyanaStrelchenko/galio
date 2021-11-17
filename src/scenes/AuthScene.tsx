import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { getGoogleAuthorizeUrl } from '../services/auth'
import { useReferrer } from '../hooks/useReferrer'
import { GoogleIcon } from '../components/Icons/GoogleIcon'
import { Button } from '../components/Button/Button'

const Label = styled.span`
  margin-left: 8px;
`

type State = {
  referrer?: string
}

export const AuthScene = () => {
  const location = useLocation<State | undefined>()
  const { setReferrer } = useReferrer()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const referrer = location.state?.referrer

    if (referrer) {
      setReferrer(referrer)
    }
  }, [location.state?.referrer, setReferrer])

  const handleClick = async () => {
    setLoading(true)

    const authUrl = await getGoogleAuthorizeUrl()

    window.location.replace(authUrl)

    setLoading(false)
  }

  return (
    <div>
      <Button loading={loading} onClick={handleClick}>
        <GoogleIcon />
        <Label>Login With Google</Label>
      </Button>
    </div>
  )
}
