import { separateTaskByGroup } from './taskUtils'
import { inputTasks, outputGroups } from './__mocks__/tasksDataMock'

it('should separate tasks to groups with correct format', () => {
  const groups = separateTaskByGroup(inputTasks)
  expect(groups).toEqual(outputGroups)
})
