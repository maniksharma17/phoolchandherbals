import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Login user
      login: (userData, authToken) => {
        set({
          user: userData,
          token: authToken,
          isAuthenticated: true
        });
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
      },

      // Logout user
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      },

      // Update user profile
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData }
        }));
        localStorage.setItem('user', JSON.stringify({ ...get().user, ...userData }));
      },

      // Set loading state
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // Initialize from localStorage
      initialize: () => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({
              user,
              token,
              isAuthenticated: true
            });
          } catch (error) {
            console.error('Error parsing user data:', error);
            get().logout();
          }
        }
      }
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);