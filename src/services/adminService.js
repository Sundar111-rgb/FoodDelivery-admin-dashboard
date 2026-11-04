
import api from './api';

// Fetch all users for Admin Dashboard
export const getAdminUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

// Create a new user
export const createAdminUser = async (userData) => {
  const response = await api.post('/admin/users', userData);
  return response.data;
};

export const getAdminRestaurants = async () => {
  const response = await api.get('/admin/restaurants');
  return response.data;
};

export const updateRestaurantStatus = async (id, isOpen) => {
  const response = await api.patch(
    `/admin/restaurants/${id}/status`,
    { isOpen }
  );

  return response.data;
};

export const createAdminRestaurant = async (restaurantData) => {
  const response = await api.post(
    '/admin/restaurants',
    restaurantData
  );

  return response.data;
};


export const updateAdminRestaurant = async (id, restaurantData) => {
  const response = await api.put(
    `/admin/restaurants/${id}`,
    restaurantData
  );

  return response.data;
};

export const getAdminOrders = async () => {
  const response = await api.get('/admin/orders');
  return response.data;
};

export const getAdminDeliveryPartners = async () => {
  const response = await api.get('/admin/delivery-partners');
  return response.data;
};


// Create a new menu item
export const createMenuItem = async (restaurantId, menuData) => {
  const response = await api.post(
    `/restaurants/${restaurantId}/menu`,
    menuData
  );

  return response.data;
};
