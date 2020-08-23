import React from 'react'
import { makeStyles } from '@material-ui/core'
import { red } from '@material-ui/core/colors'

export const ErrorMessage = ({ message }: { message: string | boolean }) => {
  const classes = useStyles()
  return message ? <div className={classes.error}>{message}</div> : <></>
}

const useStyles = makeStyles({
  error: {
    color: red[500],
  },
})
