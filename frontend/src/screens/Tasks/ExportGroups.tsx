import { Typography } from '@material-ui/core'

import React from 'react'

export const ExportGroups = ({
  taskGroups,
  from,
  to,
  user,
}: {
  taskGroups: Partial<DayTasksGroupProps>[]
  from?: string
  to?: string
  user: Partial<UserProps>
}) => {
  return (
    <div>
      <Typography variant="h4">
        Exported tasks of {user.fullName} {from && `from ${from} `} {to && `to ${to} `}
      </Typography>
      {taskGroups &&
        taskGroups.map((refinedTask: DayTasksGroupProps, index: number) => (
          <div key={index}>
            <p>Date: {refinedTask.date}</p>
            <p>Total Time: {refinedTask.hours} hour(s)</p>
            <p>Notes:</p>
            {refinedTask.notes.map((note: string, i: number) => (note ? <p key={i}>- {note}</p> : ''))}
            <hr />
          </div>
        ))}
    </div>
  )
}
