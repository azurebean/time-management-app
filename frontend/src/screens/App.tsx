import React from 'react'
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom'
import { PrivateRoute, PublicRoute } from '../components'
import { TasksScreen, UsersScreen, LoginScreen, SignUpScreen, ProfileScreen, Header, ExportScreen, Footer } from '.'
import { Container } from '@material-ui/core'

export const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Container maxWidth="md">
        <Switch>
          <PublicRoute path="/login" component={LoginScreen} />
          <PublicRoute path="/signup" component={SignUpScreen} />
          <PrivateRoute exact path="/" component={TasksScreen} />
          <PrivateRoute exact path="/profile" component={ProfileScreen} />
          <PrivateRoute exact path="/users" component={UsersScreen} />
          <Route path="/export" component={ExportScreen} />
          <Redirect to="/" />
        </Switch>
      </Container>
      <Footer />
    </BrowserRouter>
  )
}
