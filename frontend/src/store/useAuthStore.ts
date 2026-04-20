import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface AuthState {
  user: { id?: string; name: string; email: string; role: string } | null;
  accessToken: string | null;
  isInitialized: boolean;
  setAuth: (
    user: { id?: string; name: string; email: string; role: string },
    token: string,
  ) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isInitialized: false,
      setAuth: (user, accessToken) => set({ user, accessToken }),
      setToken: (accessToken) => set({ accessToken }),
      clearAuth: () => set({ user: null, accessToken: null, isInitialized: true }),
      // Gọi khi app khởi động để phục hồi session từ refreshToken cookie
      initializeAuth: async () => {
        if (get().accessToken) {
          set({ isInitialized: true });
          return;
        }
        try {
          const res = await axios.post(
            `${API_URL}/auth/refresh`,
            {},
            { withCredentials: true },
          );
          set({ accessToken: res.data.accessToken, isInitialized: true });
        } catch {
          // Không có session hợp lệ → bình thường, user chưa đăng nhập
          set({ isInitialized: true });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
