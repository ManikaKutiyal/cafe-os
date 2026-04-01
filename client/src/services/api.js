import axios from 'axios';

const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const sanitizedBase = rawBase.replace(/\/$/, '');
const baseURL = sanitizedBase.endsWith('/api') ? sanitizedBase : `${sanitizedBase}/api`;

// Check if running on a deployed site but still using localhost API
if (typeof window !== 'undefined' &&
  !window.location.hostname.includes('localhost') &&
  baseURL.includes('localhost')) {
  console.warn(
    `[API] Currently connecting to ${baseURL} while the app is running on ${window.location.origin}. ` +
    `Ensure VITE_API_URL is set correctly in your deployment environment.`
  );
}

const getToken = () => localStorage.getItem('token');

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const method = error.config?.method?.toUpperCase() || 'GET';
    const path = error.config?.url || 'unknown-endpoint';
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong while talking to the server.';

    console.error(`[API ${method}] ${path}`, error);
    return Promise.reject(new Error(message));
  }
);

export async function apiRequest(config) {
  const response = await api(config);
  return response.data;
}

export const signup = (data) =>
  apiRequest({ url: '/auth/signup', method: 'post', data });

export const login = (data) =>
  apiRequest({ url: '/auth/login', method: 'post', data });

export const getProfile = () =>
  apiRequest({ url: '/auth/profile', method: 'get' });

const ownerApi = {
  getMenuItems: (cafeId) =>
    apiRequest({ url: cafeId ? `/menu?cafeId=${cafeId}` : '/menu', method: 'get' }),
  addMenuItem: (item) =>
    apiRequest({ url: '/menu', method: 'post', data: item }),
  updateMenuItem: (id, item) =>
    apiRequest({ url: `/menu/${id}`, method: 'put', data: item }),
  deleteMenuItem: (id) =>
    apiRequest({ url: `/menu/${id}`, method: 'delete' }),
  updateStock: (id, inStock) =>
    apiRequest({ url: `/menu/${id}/stock`, method: 'patch', data: { inStock } }),
  getStaff: () =>
    apiRequest({ url: '/staff', method: 'get' }),
  addStaff: (staff) =>
    apiRequest({ url: '/staff', method: 'post', data: staff }),
  updateStaff: (id, staff) =>
    apiRequest({ url: `/staff/${id}`, method: 'put', data: staff }),
  deleteStaff: (id) =>
    apiRequest({ url: `/staff/${id}`, method: 'delete' }),
  getCustomers: () =>
    apiRequest({ url: '/customers', method: 'get' }),
  getCustomerDetails: (id) =>
    apiRequest({ url: `/customers/${id}`, method: 'get' }),
  addCustomer: (customer) =>
    apiRequest({ url: '/customers', method: 'post', data: customer }),
  addOrder: (customerId, order) =>
    apiRequest({ url: `/customers/${customerId}/orders`, method: 'post', data: order }),

  // Table Management
  getTables: (cafeId) =>
    apiRequest({ url: `/tables/${cafeId}`, method: 'get' }),
  generateTables: (cafeId, numberOfTables) =>
    apiRequest({ url: '/tables/generate', method: 'post', data: { cafeId, numberOfTables } }),
  freeTable: (cafeId, tableNumber) =>
    apiRequest({ url: `/tables/${cafeId}/${tableNumber}/free`, method: 'post' }),
  occupyTable: (cafeId, tableNumber) =>
    apiRequest({ url: `/tables/${cafeId}/${tableNumber}/occupy`, method: 'post' }),
  getTableStatus: (cafeId, tableNumber) =>
    apiRequest({ url: `/tables/${cafeId}/${tableNumber}`, method: 'get' }),

  // Owner Location Settings
  getLocationSettings: (ownerId) =>
    apiRequest({ url: `/auth/owner/${ownerId}/locationSettings`, method: 'get' }),
  updateLocationSettings: (ownerId, settings) =>
    apiRequest({ url: `/auth/owner/${ownerId}/locationSettings`, method: 'put', data: settings }),
};

export default ownerApi;
