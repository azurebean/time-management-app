import React, { useState, useContext } from 'react'
import { AuthContext } from '../../contexts'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Button } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { UserModal } from '../'
import { useQueryGenerator } from '../../hooks'
import { api, ROLES } from '../../helpers'

export const UserRow = ({ user, refresh }: { user: UserProps; refresh: () => void }) => {
  const { profile } = useContext(AuthContext)
  const [userModalOpen, setUserModalOpen] = useState<boolean>(false)
  const { request: deleteUser } = useQueryGenerator(api.user(user.uuid))

  const removeUser = async () => {
    await deleteUser({ localMethod: 'DELETE' })
    refresh()
  }

  return (
    <TableRow key={user.uuid}>
      <TableCell component="th" scope="user" data-cy="user_full_name">
        {user.fullName}
      </TableCell>
      <TableCell align="right">{user.roleName}</TableCell>
      <TableCell align="right" data-cy="user_email">
        {user.email}
      </TableCell>
      <TableCell align="right">{user.dailyHours ? `${user.dailyHours}h` : 'N/A'}</TableCell>
      <TableCell align="right">
        {(profile.role === ROLES.ADMIN || user.role !== ROLES.ADMIN) && (
          <>
            <IconButton aria-label="edit-task" onClick={() => setUserModalOpen(true)} data-cy="edit_user_button" data-id={user.email}>
              <EditIcon />
            </IconButton>
            <IconButton aria-label="delete-task" onClick={() => removeUser()} data-cy="delete_user_button">
              <DeleteIcon />
            </IconButton>
          </>
        )}
        <UserModal user={user} open={userModalOpen} handleClose={() => setUserModalOpen(false)} refresh={refresh} />
      </TableCell>
    </TableRow>
  )
}
