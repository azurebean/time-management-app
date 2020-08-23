import React, { useState, useContext, ChangeEvent } from 'react'
import { Paper, Typography, Button, Select, MenuItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Timelapse from '@material-ui/icons/Timer'
import { Link } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import { ROLES } from '../../helpers'
import { AuthContext } from '../../contexts'

export const ControlPanel = ({
  dailyHours,
  selectedUser,
  setSelectedUser,
  setStartDate,
  setEndDate,
  users,
  startDate,
  endDate,
  openTaskModal,
  exportContent,
  search,
}: {
  dailyHours: number
  selectedUser: Partial<UserProps>
  setSelectedUser: any
  setStartDate: (date: Date) => void
  setEndDate: (date: Date) => void
  users: RawUserProps[]
  startDate: Date
  endDate: Date
  openTaskModal: () => void
  search: () => void
  exportContent: string
}) => {
  const classes = useStyles()
  const { profile } = useContext(AuthContext)

  const handleSelectChange = (event: ChangeEvent<HTMLInputElement>) => {
    const user = users.find((user: RawUserProps) => user.uuid === event.target.value)
    setSelectedUser({ uuid: user.uuid, fullName: user.full_name, dailyHours: user.daily_work_hours })
  }

  return (
    <div>
      <Paper className={classes.panel}>
        <div className={classes.panelControl}>
          <DatePicker
            dateFormat="yyyy-MM-dd"
            selected={startDate}
            onChange={(date: Date) => setStartDate(date)}
            className={classes.dateInput}
            placeholderText="From"
            id="from"
          />
          <DatePicker
            dateFormat="yyyy-MM-dd"
            selected={endDate}
            onChange={(date: Date) => setEndDate(date)}
            className={classes.dateInput}
            placeholderText="To"
            id="to"
          />
          <Button variant="contained" color="secondary" className={classes.panelItem} onClick={search} data-cy="search_button">
            Search
          </Button>
        </div>
        <div>
          {profile.role == ROLES.ADMIN && selectedUser.uuid && users && (
            <div className={classes.panelItem}>
              <Select labelId="userSelectLabel" id="userSelect" value={selectedUser.uuid} onChange={handleSelectChange}>
                {users.map((user: RawUserProps) => (
                  <MenuItem value={user.uuid} key={user.uuid}>
                    {user.full_name}
                  </MenuItem>
                ))}
              </Select>
            </div>
          )}
          {dailyHours && (
            <Typography variant="body2" className={classes.panelItem}>
              <Timelapse /> {dailyHours}h/day
            </Typography>
          )}
        </div>
      </Paper>

      <div className={classes.secondary_buttons}>
        <Button variant="contained" color="primary" className={classes.secondary_button} onClick={openTaskModal} data-cy="new_task_button">
          New Task
        </Button>
        <Link to={`/export?data=${exportContent}`} target="_blank">
          <Button variant="contained" color="primary" className={classes.secondary_button}>
            Export
          </Button>
        </Link>
      </div>
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  panel: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
    [theme.breakpoints.up(780)]: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  },
  panelControl: {
    [theme.breakpoints.up(780)]: {
      display: 'flex',
      alignItems: 'center',
    },
  },
  panelItem: {
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
  timeItem: {
    marginTop: theme.spacing(2),
    [theme.breakpoints.up(780)]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
  },
  dateInput: {
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(2),
    padding: '0.5rem',
  },
  secondary_buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  secondary_button: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
}))
