import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { TaskModal } from '..'
import moment from 'moment'
import { useQueryGenerator } from '../../hooks'
import { api, DATE_FORMAT } from '../../helpers'

interface ModalProps {
  open: boolean
  handleClose: () => void
  task?: Partial<TaskProps>
  assignee: string
  assigneeUuid: string
  refresh: () => void
}

const TaskSchema = Yup.object().shape({
  name: Yup.string().max(50, 'Task name is too long').required('Required'),
  duration: Yup.number().min(1, 'Duration must be at least 1 hour').required('Required').integer('Duration must be integer'),
  date: Yup.string().required('Required'),
  note: Yup.string().max(100, 'Note is too long'),
})

export const AddEditTask = ({ task, assignee, assigneeUuid, open, handleClose, refresh }: ModalProps) => {
  const { request: addNewTask } = useQueryGenerator(api.tasks)
  const localUrl = task ? api.task(task.id) : api.tasks
  const localMethod = task ? 'PATCH' : 'POST'
  const isAdd = task ? false : true

  const { id, name, duration, date, note } = task || {
    id: 0,
    name: '',
    duration: 1,
    date: moment().format(DATE_FORMAT),
    note: '',
  }

  const formik = useFormik({
    initialValues: {
      id,
      name,
      duration,
      date,
      note,
    },
    validationSchema: TaskSchema,
    onSubmit: async (values) => {
      await addNewTask({ localData: { ...values, assignee: assigneeUuid }, localMethod, localUrl })
      refresh()
      handleClose()
    },
  })

  return <TaskModal add={isAdd} formik={formik} open={open} handleClose={handleClose} assignee={assignee} />
}
