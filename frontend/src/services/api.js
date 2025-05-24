// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

// Add a request interceptor to include the Authorization token if it exists in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginAdmin = async (email, password) => {
  try {
    const response = await api.post('/admin/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error.response ? error.response.data : 'Login failed. Please try again later.';
  }
};

export const fetchOrders = async () => {
  try {
    const response = await api.get('/api/admin/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error.response ? error.response.data : 'Failed to fetch orders. Please try again later.';
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.put(`/api/admin/orders/${orderId}`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating status for order ${orderId}:`, error);
    throw error.response ? error.response.data : 'Failed to update order status. Please try again later.';
  }
};

