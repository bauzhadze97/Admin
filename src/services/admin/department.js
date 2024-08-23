import defaultInstance from '../../plugins/axios'

export const getDepartments = async () => {
  return defaultInstance.get('/api/admin/department/list')
}

export const createDepartment = async (data) => {
  return defaultInstance.post('/api/admin/department/create', data)
}

export const deleteDepartment = async(id) => {
  return defaultInstance.post('/api/admin/department/' + id.id + '/delete')
}

export const assignHead = async (data) => {
  return defaultInstance.post('/api/admin/department/assign-head', data)
}

export const getUsers = async () => {
  return defaultInstance.get('/api/admin/users');
}

export const deleteUser = async (id) => {
  console.log(id)
  return defaultInstance.post('/api/admin/delete-user/' + id)
}