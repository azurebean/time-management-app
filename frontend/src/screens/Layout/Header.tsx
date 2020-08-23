import React, { useState, useContext, ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../contexts'
import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { indigo } from '@material-ui/core/colors'
import { ROLES } from '../../helpers/vars'

export const Header = () => {
  const classes = useStyles()
  const { profile, logout, isAuth } = useContext(AuthContext)

  const Link = ({ to, children }: { to: string; children: ReactNode }) => (
    <NavLink to={to} exact className={classes.link} activeClassName={classes.activeLink}>
      {children}
    </NavLink>
  )

  const isAdminOrManager = [ROLES.ADMIN, ROLES.MANAGER].includes(profile.role)

  return (
    <header>
      <Paper elevation={3} square className={classes.header}>
        <Link to="/">Tasks</Link>
        {isAdminOrManager && <Link to="/users">Users</Link>}
        {!isAuth() ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        ) : (
          <>
            <Link to="/profile">{profile.fullName}</Link>
            <a onClick={logout} className={classes.link}>
              Log out
            </a>
          </>
        )}
      </Paper>
    </header>
  )
}

const useStyles = makeStyles((theme) => ({
  header: {
    padding: theme.spacing(2),
    textAlign: 'right',
  },
  link: {
    margin: theme.spacing(2),
    textDecoration: 'none',
    fontSize: '1rem',
    color: indigo[300],
    cursor: 'pointer',
  },
  activeLink: {
    color: indigo[900],
  },
}))
