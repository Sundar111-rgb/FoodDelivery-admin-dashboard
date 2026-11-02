import api from './api';

export const registerUser = async (name, email, password) => {
  const response = await api.post('/auth/register', {
    name,
    email,
    password,
  });

  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', {
    email,
    password,
  });

  const { token, user } = response.data;

  // Only ADMIN accounts can access the admin dashboard.
  if (user?.role !== 'ADMIN') {
    throw new Error(
      'Access denied. This account is not an administrator.'
    );
  }

  if (!token) {
    throw new Error('Login succeeded, but no authentication token was returned.');
  }

  localStorage.setItem('adminToken', token);
  localStorage.setItem('adminUser', JSON.stringify(user));

  return user;
};

export const logoutUser = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
};
