import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../services/api";

interface Job {
  id: string;
  name: string;
  wagePerHour: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  jobs: Job[];
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  setTokens: (accessToken: string, refreshToken: string, user: User) => void;
  refreshAccessToken: () => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setTokens: (accessToken, refreshToken, user) =>
        set({ accessToken, refreshToken, user }),
      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return false;

        try {
          const response = await api.post("/auth/refresh", { refreshToken });
          const { accessToken: newAccessToken } = response.data;
          set({ accessToken: newAccessToken });
          return true;
        } catch (error) {
          console.error("Token refresh failed:", error);
          set({ accessToken: null, refreshToken: null, user: null });
          return false;
        }
      },
      logout: async () => {
        const currentUser = get().user;
        try {
          if (currentUser?.id) {
            await api.post("/auth/logout", { userId: currentUser.id });
          }
        } catch (error) {
          console.error("Logout API call failed:", error);
        } finally {
          set({ accessToken: null, refreshToken: null, user: null });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
