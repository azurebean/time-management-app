export const separateTaskByGroup = (rawTasks: Array<RawTaskProps>) => {
  let groups: Partial<{ [id: string]: DayTasksGroupProps }> = {}
  for (const rawTask of rawTasks) {
    const date = rawTask.date
    const task = {
      id: rawTask.id,
      name: rawTask.name,
      duration: rawTask.duration,
      note: rawTask.note,
      date: rawTask.date,
      assignee: rawTask.assignee.full_name,
      assigneeUuid: rawTask.assignee.uuid,
    }

    if (!groups[date]) {
      groups[date] = {
        date: date,
        hours: rawTask.duration,
        notes: [rawTask.note],
        data: [task],
      }
    } else {
      groups[date].data.push(task)
      groups[date].notes.push(rawTask.note)
      groups[date].hours += rawTask.duration
    }
  }
  return Object.values(groups).sort((t1: DayTasksGroupProps, t2: DayTasksGroupProps) => (t1.date > t2.date ? -1 : 1))
}
