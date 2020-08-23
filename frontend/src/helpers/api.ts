const server = 'http://localhost:8000'
const makeUrl = (url: string) => `${server}/${url}`

export const api = {
  login: makeUrl('token/'),
  refreshToken: makeUrl('token/refresh/'),
  signup: makeUrl('api/users/'),

  profile: makeUrl('api/profile/'),

  users: makeUrl(`api/users/`),
  user: (uuid: string) => makeUrl(`api/users/${uuid}/`),

  tasks: makeUrl('api/tasks/'),
  task: (id: number) => makeUrl(`api/tasks/${id}/`),
}
