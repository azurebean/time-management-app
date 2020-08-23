import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { IconButton, Typography, Card, CardContent, CardActions, Box } from '@material-ui/core'
import { red } from '@material-ui/core/colors'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import Timelapse from '@material-ui/icons/Timer'
import { AddEditTask } from '../'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  cardRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icons: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: 0,
  },
  avatar: {
    backgroundColor: red[500],
  },
}))

export const TaskCard = ({ task, removeTask, search }: { task: TaskProps; removeTask: (id: number) => void; search: () => void }) => {
  const classes = useStyles()
  const [taskModalOpen, setTaskModalOpen] = useState<boolean>(false)

  return (
    <div data-cy="task_card">
      <Card>
        <CardContent className={classes.root}>
          <div className={classes.cardRow}>
            <Typography variant="body1" color="primary" component="p" data-cy="task_name">
              {task.name}
            </Typography>
            <CardActions disableSpacing className={classes.icons}>
              <IconButton aria-label="edit-task" onClick={() => setTaskModalOpen(true)} data-cy="edit_button">
                <EditIcon />
              </IconButton>
              <IconButton aria-label="delete-task" onClick={() => removeTask(task.id)} data-cy="delete_button">
                <DeleteIcon />
              </IconButton>
              <div className={classes.icons}>
                <Timelapse />
                <Typography variant="body1" color="textSecondary" component="p">
                  {task.duration}h
                </Typography>
              </div>
            </CardActions>
          </div>
          <div className={classes.cardRow}>
            <Typography variant="body2" color="textPrimary" component="p">
              {task.note}
            </Typography>
          </div>
        </CardContent>
      </Card>
      <AddEditTask
        open={taskModalOpen}
        handleClose={() => setTaskModalOpen(false)}
        assignee={task.assignee}
        assigneeUuid={task.assigneeUuid}
        refresh={search}
        task={task}
      />
    </div>
  )
}
