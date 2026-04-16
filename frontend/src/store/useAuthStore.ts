import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: { id?: string; name: string; email: string; role: string } | null;
  accessToken: string | null;
  setAuth: (
    user: { id?: string; name: string; email: string; role: string },
    token: string,
  ) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      // Hàm này được gọi khi đăng nhập thành công (lưu cả user lẫn token)
      setAuth: (user, accessToken) => set({ user, accessToken }),
      // Hàm này được gọi bởi Interceptor khi làm mới token (chỉ cập nhật token, giữ nguyên user)
      setToken: (accessToken) => set({ accessToken }),
      // Hàm này dùng để đăng xuất
      clearAuth: () => set({ user: null, accessToken: null }),
    }),
    {
      name: "auth-storage",
      // Chỉ lưu "user" vào localStorage, KHÔNG lưu accessToken
      // accessToken chỉ sống trên RAM → an toàn hơn, tránh XSS lấy trộm
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
