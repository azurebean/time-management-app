import React, { FC, useContext } from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'
import { AuthContext } from '../../contexts'

export const PublicRoute: FC<RouteProps> = (props) => {
  const { isAuth } = useContext(AuthContext)
  return isAuth() ? <Redirect to="/" /> : <Route {...props} />
}
