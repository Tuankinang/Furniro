import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

// ─── 1. TẠO "XE TẢI" AXIOS ──────────────────────────────────────────────────
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true, // Luôn mang theo Cookie (chứa refreshToken) trong mọi request
});

// ─── 2. INTERCEPTOR GỬI ĐI (Request Interceptor) ────────────────────────────
// Chạy TRƯỚC KHI mỗi request được gửi đi
// Nhiệm vụ: Lấy accessToken từ Store → Gắn vào header "Authorization: Bearer <token>"
api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

// ─── 3. BIẾN CỜ CHẶN (Chống gọi /refresh nhiều lần cùng lúc) ────────────────
// Ví dụ: Nếu 3 request cùng nhận 401, chỉ 1 lần gọi /refresh là đủ
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// Hàm xử lý hàng đợi: Sau khi refresh xong, cho các request đang chờ đi tiếp
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error); // Nếu refresh thất bại → báo lỗi cho tất cả
    } else {
      promise.resolve(token); // Nếu thành công → trả token mới cho tất cả
    }
  });
  failedQueue = []; // Dọn sạch hàng đợi
};

// ─── 4. INTERCEPTOR NHẬN VỀ (Response Interceptor) ──────────────────────────
// Chạy SAU KHI nhận được response từ Backend
// Nhiệm vụ: Bắt lỗi 401 → âm thầm đổi token mới → gọi lại request bị hỏng
api.interceptors.response.use(
  (response) => response, // Nếu không lỗi thì cho qua bình thường

  async (error) => {
    const originalRequest = error.config;

    // Chỉ xử lý đặc biệt khi: lỗi là 401 VÀ chưa thử refresh lần nào
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Đánh dấu request này đã được thử refresh (tránh vòng lặp vô tận)
      originalRequest._retry = true;

      // Nếu đang có một request khác đang đi đổi token → xếp vào hàng đợi
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest); // Gọi lại với token mới
          })
          .catch((err) => Promise.reject(err));
      }

      // Cắm cờ: "Đang đi đổi token, các request khác xếp hàng chờ!"
      isRefreshing = true;

      try {
        // Âm thầm gọi API /refresh (trình duyệt tự mang refreshToken trong Cookie đi)
        const response = await api.post("/auth/refresh");
        const newAccessToken = response.data.accessToken;

        // Cập nhật token mới vào "Tổng đài" Zustand Store
        useAuthStore.getState().setToken(newAccessToken);

        // Thông báo cho các request đang chờ: "Có token mới rồi, đi tiếp đi!"
        processQueue(null, newAccessToken);

        // Gọi lại request gốc đã bị hỏng (với token mới)
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh thất bại (refreshToken đã hết hạn 7 ngày) → Đăng xuất bắt buộc
        processQueue(refreshError, null);
        useAuthStore.getState().clearAuth();
        window.location.href = "/login"; // Văng ra trang Login
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false; // Hạ cờ xuống, cho phép refresh lại bình thường
      }
    }

    // Các lỗi khác (403, 404, 500...) thì trả lại bình thường để từng trang tự xử lý
    return Promise.reject(error);
  },
);

export default api;
