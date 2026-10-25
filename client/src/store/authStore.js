import { create } from 'zustand';
import { mockUsers } from './mockData';

const authStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  setUser: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token || 'mock-token');
    set({ user, token: token || 'mock-token', error: null });
  },

  clearAuth: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  loadFromStorage: () => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      set({ user: JSON.parse(storedUser), token: storedToken });
      return true;
    }
    return false;
  },

  loginWithMockUser: (userType) => {
    const user = mockUsers[userType];
    if (user) {
      set({ user, token: 'mock-token', error: null });
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', 'mock-token');
      return user;
    }
    set({ error: 'Invalid user type' });
    return null;
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

export default authStore;
