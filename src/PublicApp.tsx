import React from 'react'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'

import { AuthScene } from './scenes/AuthScene'
import { GoogleAuthScene } from './scenes/GoogleAuthScene'

export const PublicApp = () => {
  const location = useLocation()

  return (
    <Switch>
      <Route exact path="/auth" component={AuthScene} />
      <Route exact path="/google-auth" component={GoogleAuthScene} />
      <Redirect to={{ pathname: '/auth', state: { referrer: location.pathname } }} />
    </Switch>
  )
}
