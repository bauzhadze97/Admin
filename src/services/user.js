import defaultInstance from '../plugins/axios'

export const changePassword = async (data) => {
    return defaultInstance.post('/api/change-password', data)
}

export const updateUser = async (data) => {
  return defaultInstance.post('/api/update-profile', data);
}

export const fetchUser = async () => {
  return defaultInstance.get('/api/user');
}