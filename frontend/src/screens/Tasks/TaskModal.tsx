import React from 'react'
import { Modal, TextField, Typography, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { ErrorMessage } from '../../components'
import { FormikValues } from 'formik'

interface TaskModalProps {
  add: boolean
  open: boolean
  handleClose: () => void
  assignee: string
  formik: FormikValues
}

export const TaskModal = ({ add, assignee, formik, open, handleClose }: TaskModalProps) => {
  const classes = useStyles()

  return (
    <Modal open={open} onClose={handleClose}>
      <div className={classes.modal} style={modalStyle}>
        <Typography variant="h6">
          {add ? 'Add task' : 'Update task'} for {assignee}
        </Typography>
        <form noValidate onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            data-cy="date"
            id="date"
            label="Date"
            type="date"
            defaultValue={formik.values.date}
            onChange={formik.handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <ErrorMessage message={formik.touched.date && formik.errors.date} />

          <TextField
            autoFocus
            variant="outlined"
            margin="normal"
            fullWidth
            label="Task Name"
            data-cy="name"
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && formik.errors.name && true}
          />
          <ErrorMessage message={formik.touched.name && formik.errors.name} />

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Duration (hours)"
            data-cy="duration"
            id="duration"
            name="duration"
            value={formik.values.duration}
            onChange={formik.handleChange}
            error={formik.touched.duration && formik.errors.duration && true}
          />
          <ErrorMessage message={formik.touched.duration && formik.errors.duration} />

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            data-cy="note"
            label="Note"
            id="note"
            name="note"
            value={formik.values.note}
            onChange={formik.handleChange}
            error={formik.touched.note && formik.errors.note && true}
          />
          <ErrorMessage message={formik.touched.note && formik.errors.note} />

          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} data-cy="submit_task">
            {add ? 'Add New Task' : 'Update Task'}
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
