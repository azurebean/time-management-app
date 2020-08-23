import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@material-ui/core'

import { useQuery } from '../hooks'
import { api, ROLES } from '../helpers'
import { UserRow } from '.'

export const UsersScreen = () => {
  const classes = useStyles()
  const { data: rawUsers, request: requestUsers } = useQuery(api.users)

  if (!rawUsers) return <div></div>

  const users: UserProps[] = rawUsers.map((rawUser: RawUserProps) => ({
    uuid: rawUser.uuid,
    fullName: rawUser.full_name,
    email: rawUser.email,
    dailyHours: rawUser.daily_work_hours,
    role: rawUser.role,
    roleName: Object.keys(ROLES).find((key: string) => ROLES[key] === rawUser.role),
  }))

  return (
    <>
      <Typography variant="h6" className={classes.title}>
        Users
      </Typography>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Role</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">PDH</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user: UserProps) => (
              <UserRow user={user} refresh={requestUsers} key={user.uuid} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  title: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  table: {},
}))
