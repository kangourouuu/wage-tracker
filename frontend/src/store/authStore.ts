import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../services/api'; // Import the api instance

interface User {
  id: string;
  name: string;
  email: string;
  wagePerHour: number;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  setTokens: (accessToken: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setTokens: (accessToken, user) => set({ accessToken, user }),
      logout: async () => {
        try {
          await api.post('/auth/logout'); // Call backend logout endpoint
        } catch (error) {
          console.error('Logout API call failed:', error);
          // Optionally handle error, but still clear local state
        } finally {
          set({ accessToken: null, user: null });
        }
      },
    }),
    {
      name: 'auth-storage', 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);
