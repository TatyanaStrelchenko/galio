import React from 'react'
import { Route, RouteProps, RouteComponentProps } from 'react-router-dom'

import { useUser } from '../User/UserProvider'
import { NotFoundScene } from '../../scenes/NotFoundScene'

type Props = RouteProps & {
  notFoundComponent?: React.ComponentType<RouteComponentProps>
}

export const ProtectedRoute = ({
  notFoundComponent: NotFoundComponent = NotFoundScene,
  component,
  ...props
}: Props) => {
  const { user } = useUser()

  if (!user) {
    return <Route {...props} render={(routeProps) => <NotFoundComponent {...routeProps} />} />
  }

  return <Route component={component} {...props} />
}
