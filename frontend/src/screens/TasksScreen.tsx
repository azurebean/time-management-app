import React, { useContext, useState, useEffect, ChangeEvent } from 'react'
import { AuthContext } from '../contexts'
import { useQuery, useQueryGenerator } from '../hooks'
import { api, DATE_FORMAT } from '../helpers'
import moment from 'moment'

import 'react-datepicker/dist/react-datepicker.css'
import { taskUtils } from '../helpers'
import { ExportGroups, ControlPanel, TaskGroups, AddEditTask } from '.'
import { queryString } from 'object-query-string'
import { renderToStaticMarkup } from 'react-dom/server'

export const TasksScreen = () => {
  const { profile } = useContext(AuthContext)
  const { data: tasks, loading, error, request: fetchTask } = useQuery(api.tasks)
  const { data: deleted, request: deleteTask } = useQueryGenerator(api.task(0))

  const [selectedUser, setSelectedUser] = useState<Partial<UserProps>>(profile)
  const [dailyHours, setDailyHours] = useState<number>(selectedUser.dailyHours)

  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const { data: users } = useQuery(api.users)
  const [taskModalOpen, setTaskModalOpen] = useState<boolean>(false)

  useEffect(() => {
    if (!selectedUser.uuid) {
      setSelectedUser(profile)
      setDailyHours(profile.dailyHours)
    }
  }, [profile])

  useEffect(() => {
    search()
  }, [selectedUser, deleted])

  const from = startDate ? moment(startDate).format(DATE_FORMAT) : undefined
  const to = endDate ? moment(endDate).format(DATE_FORMAT) : undefined

  const search = async () => {
    let filters: { [id: string]: string } = {}
    selectedUser.uuid && (filters['assignee'] = selectedUser.uuid)
    from && (filters['from'] = from)
    to && (filters['to'] = to)

    const filterQuery = queryString(filters)

    await fetchTask({ localUrl: `${api.tasks}?${filterQuery}` })
    setDailyHours(selectedUser.dailyHours)
  }

  const removeTask = (id: number) => {
    deleteTask({ localUrl: api.task(id), localMethod: 'DELETE' })
  }

  if (error) {
    return <div>Error loading task</div>
  }

  const taskGroups: Partial<DayTasksGroupProps>[] = tasks ? taskUtils.separateTaskByGroup(tasks) : []
  const exportContent = renderToStaticMarkup(<ExportGroups taskGroups={taskGroups} from={from} to={to} user={selectedUser} />)

  return (
    <div>
      <ControlPanel
        dailyHours={dailyHours}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        users={users}
        startDate={startDate}
        endDate={endDate}
        openTaskModal={() => setTaskModalOpen(true)}
        exportContent={exportContent}
        search={search}
      />
      <AddEditTask
        open={taskModalOpen}
        handleClose={() => setTaskModalOpen(false)}
        assignee={selectedUser.fullName}
        assigneeUuid={selectedUser.uuid}
        refresh={search}
      />
      <TaskGroups taskGroups={taskGroups} dailyHours={dailyHours} isLoading={loading} removeTask={removeTask} search={search} />
    </div>
  )
}
