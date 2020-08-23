import React from 'react'
import { Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

export const Footer = () => {
  const classes = useStyles()

  return <footer className={classes.footer} />
}

const useStyles = makeStyles((theme) => ({
  footer: {
    padding: theme.spacing(4),
  },
}))
