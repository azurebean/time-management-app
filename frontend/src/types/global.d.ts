declare type FetchFunction = (props?: {
  localData?: any
  localUrl?: string
  localToken?: string
  localMethod?: Method
  isCancelled?: boolean
}) => Promise<void>

declare interface State {
  loading?: boolean
  data?: any
  error?: any
  request?: FetchFunction
}

declare interface Action {
  type: string
  payload?: any
  error?: any
}

// Users
declare interface RawUserProps {
  uuid: string
  full_name: string
  email: string
  role: number
  daily_work_hours?: number
}

declare interface UserProps {
  uuid: string
  fullName: string
  email: string
  role: number
  roleName?: string
  dailyHours?: number
}

// Tasks
declare interface RawTaskProps {
  id: number
  name: string
  duration: number
  date: string
  assignee: RawUserProps
  note?: string
}

declare interface TaskProps {
  id: number
  name: string
  duration: number
  note?: string
  date: string
  assignee: string
  assigneeUuid: string
}

declare interface DayTasksGroupProps {
  date: string
  hours: number
  notes: [string]
  data: [TaskProps]
}

// declare type ModalTaskProps = {
//   id: number
//   name: string
//   duration?: number
//   note?: string
//   date?: string
// }

type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK'
