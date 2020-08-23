import React, { useContext, useEffect, useState } from 'react'
import { UserModal } from '.'
import { useQuery } from '../hooks'
import { api } from '../helpers'
import { AuthContext } from '../contexts'
import { Paper, Button, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

export const ProfileScreen = () => {
  const classes = useStyles()
  const { data: rawProfile, request: requestProfile } = useQuery(api.profile)
  const { profile, saveProfile } = useContext(AuthContext)
  const [userModalOpen, setUserModalOpen] = useState<boolean>(false)

  useEffect(() => {
    if (rawProfile) {
      saveProfile(rawProfile)
    }
  }, [rawProfile])

  return (
    <div className={classes.profile}>
      {profile.uuid && (
        <Paper className={classes.card}>
          <Typography variant="h6" className={classes.text}>
            {profile.fullName}
          </Typography>
          <Typography variant="body1" className={classes.text}>
            Email: {profile.email}
          </Typography>
          <Typography variant="body1" className={classes.text}>
            Role: {profile.roleName}
          </Typography>
          <Typography variant="body1" className={classes.text}>
            Daily work hours: {profile.dailyHours ? `${profile.dailyHours}h` : 'Not specified'}
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setUserModalOpen(true)}>
            Edit Profile
          </Button>
          <UserModal user={profile} open={userModalOpen} handleClose={() => setUserModalOpen(false)} refresh={requestProfile} />
        </Paper>
      )}
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  profile: {
    marginTop: theme.spacing(4),
  },
  card: {
    padding: theme.spacing(2),
  },
  text: {
    marginBottom: theme.spacing(2),
  },
}))
