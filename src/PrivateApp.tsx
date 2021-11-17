import React from 'react'
import { applyMiddleware, createStore } from 'redux'
import { Redirect, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import reduxLogger from 'redux-logger'
import reduxThunk from 'redux-thunk'
import { Slide } from 'react-toastify'

import { User } from './types/user'
import { UserProvider } from './components/User/UserProvider'
import { rootReducer } from './store/store'
import { generateAppUrl, generateVideoUrl } from './services/urls'
import { useLastNavigationPathEffect } from './hooks/useLastNavigationPathEffect'
import { ProtectedRoute } from './components/Route/ProtectedRoute'
import { VideoScene } from './scenes/VideoScene'
import { AppScene } from './scenes/AppScene'
import { StyledToastContainer } from './utils/toaster'

const store = createStore(rootReducer, applyMiddleware(reduxLogger, reduxThunk))

type Props = {
  user: User
}

export const PrivateApp = ({ user }: Props) => {
  useLastNavigationPathEffect()

  return (
    <Provider store={store}>
      <StyledToastContainer
        autoClose={3000}
        position="bottom-center"
        transition={Slide}
        draggable={false}
        limit={1}
      />
      <UserProvider initialUser={user}>
        <Switch>
          <ProtectedRoute exact path={generateVideoUrl.path} component={VideoScene} />
          <ProtectedRoute exact path={generateAppUrl.path} component={AppScene} />
          <Redirect to={generateAppUrl()} />
        </Switch>
      </UserProvider>
    </Provider>
  )
}
