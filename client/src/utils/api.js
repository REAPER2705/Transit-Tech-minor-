import axios from 'axios';

const API_BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, displayName, password, roles) =>
    api.post('/auth/register', { email, displayName, password, roles }),
  getMe: () => api.get('/auth/me'),
};

export const passengerAPI = {
  getAssignments: () => api.get('/passenger/me/assignments'),
  getBus: () => api.get('/passenger/me/bus'),
  getAvailableBuses: (routeId) => api.get(`/passenger/routes/${routeId}/available-buses`),
  submitComplaint: (data) => api.post('/passenger/complaints', data),
  getComplaints: () => api.get('/passenger/complaints'),
  getNotifications: () => api.get('/passenger/notifications'),
  markNotificationRead: (id) => api.patch(`/passenger/notifications/${id}/read`),
  requestAssignmentChange: (data) => api.post('/passenger/assignment-requests', data),
};

export const staffAPI = {
  getAssignments: () => api.get('/staff/me/assignments'),
  startTrip: (tripId) => api.post(`/staff/trips/${tripId}/start`),
  endTrip: (tripId) => api.post(`/staff/trips/${tripId}/end`),
  postLocation: (tripId, latitude, longitude, accuracy) =>
    api.post(`/staff/trips/${tripId}/location`, { latitude, longitude, accuracy }),
  getOccupancy: (tripId) => api.get(`/staff/trips/${tripId}/occupancy`),
  updateOccupancy: (tripId, passengerCount, reason) =>
    api.post(`/staff/trips/${tripId}/occupancy`, { passengerCount, reason }),
};

export const adminAPI = {
  // Users
  createUser: (data) => api.post('/admin/users', data),
  listUsers: () => api.get('/admin/users'),
  updateUser: (id, data) => api.patch(`/admin/users/${id}`, data),

  // Buses
  createBus: (data) => api.post('/admin/buses', data),
  listBuses: () => api.get('/admin/buses'),
  updateBus: (id, data) => api.patch(`/admin/buses/${id}`, data),

  // Stops
  createStop: (data) => api.post('/admin/stops', data),
  listStops: () => api.get('/admin/stops'),

  // Routes
  createRoute: (data) => api.post('/admin/routes', data),
  listRoutes: () => api.get('/admin/routes'),

  // Schedules
  createSchedule: (data) => api.post('/admin/schedules', data),
  listSchedules: () => api.get('/admin/schedules'),

  // Assignments
  createAssignment: (data) => api.post('/admin/assignments', data),
  listAssignments: () => api.get('/admin/assignments'),

  // Complaints
  listComplaints: () => api.get('/admin/complaints'),
  updateComplaint: (id, data) => api.patch(`/admin/complaints/${id}`, data),

  // Audit
  getAuditLogs: () => api.get('/admin/audit-logs'),

  // Imports
  validateImport: (formData) =>
    api.post('/admin/imports/validate', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default api;
