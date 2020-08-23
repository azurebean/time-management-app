import React from 'react'
import { Modal, TextField, Typography, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { ErrorMessage } from '../../components'
import { FormikValues, useFormik } from 'formik'
import * as Yup from 'yup'
import { useQueryGenerator } from '../../hooks'
import { api } from '../../helpers'

interface UserModalProps {
  open: boolean
  handleClose: () => void
  user: Partial<UserProps>
  refresh: () => void
}

const UserSchema = Yup.object().shape({
  full_name: Yup.string().max(50, 'Name is too long').required('Required'),
  daily_work_hours: Yup.number().integer().min(1, 'Invalid work hours'),
})

export const UserModal = ({ open, handleClose, user, refresh }: UserModalProps) => {
  const classes = useStyles()
  const { request: updateUser } = useQueryGenerator(api.user(user.uuid))

  const formik = useFormik({
    initialValues: {
      full_name: user.fullName,
      daily_work_hours: user.dailyHours || '',
    },
    validationSchema: UserSchema,
    onSubmit: async (values) => {
      await updateUser({ localData: { ...values, daily_work_hours: values.daily_work_hours || null }, localMethod: 'PATCH' })
      refresh()
      handleClose()
    },
  })
  return (
    <Modal open={open} onClose={handleClose}>
      <div className={classes.modal} style={modalStyle}>
        <Typography variant="h6">Update information for {user.fullName}</Typography>
        <form noValidate onSubmit={formik.handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Full name"
            data-cy="full_name"
            id="full_name"
            name="full_name"
            value={formik.values.full_name}
            onChange={formik.handleChange}
            error={formik.touched.full_name && formik.errors.full_name && true}
          />
          <ErrorMessage message={formik.touched.full_name && formik.errors.full_name} />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            data-cy="daily_work_hours"
            label="Daily Work Hours"
            id="daily_work_hours"
            name="daily_work_hours"
            value={formik.values.daily_work_hours}
            onChange={formik.handleChange}
            error={formik.touched.daily_work_hours && formik.errors.daily_work_hours && true}
          />
          <ErrorMessage message={formik.touched.daily_work_hours && formik.errors.daily_work_hours} />

          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} data-cy="submit_button">
            Update
          </Button>
        </form>
      </div>
    </Modal>
  )
}

const modalStyle = {
  top: '50%',
  left: '50%',
  transform: `translate(-50%, -50%)`,
}

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: 400,
    backgroundColor: '#fff',
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  dateInput: {
    padding: '0.5rem',
  },
  submit: {
    marginTop: theme.spacing(2),
  },
}))
