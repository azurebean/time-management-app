import React from 'react'
import { Paper, Typography, Box, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { green, red } from '@material-ui/core/colors'
import { TaskCard } from '../.'

export const TaskGroups = ({
  taskGroups,
  dailyHours,
  isLoading,
  removeTask,
  search,
}: {
  taskGroups: Partial<DayTasksGroupProps>[]
  dailyHours: number
  isLoading: boolean
  removeTask: (id: number) => void
  search: () => void
}) => {
  const classes = useStyles()
  return (
    <div className={isLoading ? classes.transparent : null}>
      {taskGroups &&
        taskGroups.map((refinedTask: DayTasksGroupProps, index: number) => {
          const isLow = dailyHours && refinedTask.hours < dailyHours
          const status = isLow ? `${dailyHours - refinedTask.hours} hours left` : 'Completed'
          const itemClass = !isLow ? [classes.group, classes.groupHigh].join(' ') : [classes.group, classes.groupLow].join(' ')
          return (
            <Paper elevation={2} className={classes.card} key={index}>
              <Box className={itemClass}>
                <Typography variant="body1" className={classes.dateTitle}>
                  <span>{refinedTask.date}</span>
                </Typography>
                <span>{status}</span>
              </Box>
              <Grid container spacing={3}>
                {refinedTask.data.map((task: TaskProps, id: number) => (
                  <Grid item xs={12} key={id} className={classes.gridItem}>
                    <TaskCard task={task} removeTask={removeTask} search={search} />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )
        })}
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  transparent: {
    opacity: 0.8,
  },
  card: {
    marginTop: theme.spacing(8),
  },
  group: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupHigh: {
    backgroundColor: green[200],
  },
  groupLow: {
    backgroundColor: red[200],
  },
  gridItem: {
    paddingBottom: '0 !important',
  },
  dateTitle: {
    fontWeight: 500,
  },
}))
