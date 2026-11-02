
import api from './api';

// Fetch all users for Admin Dashboard
export const getAdminUsers = async () => {
  const response = await api.get('/admin/users');

  return response.data;
};
