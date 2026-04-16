import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Tạo một Interface mới mở rộng từ Request mặc định của Express
// Để chúng ta có thể nhét thêm thông tin user vào req
export interface AuthRequest extends Request {
  user?: any;
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  // 1. Lấy token từ header (Thường Frontend sẽ gửi lên theo chuẩn: "Authorization: Bearer <token>")
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Không tìm thấy Token. Vui lòng đăng nhập!",
    });
    return;
  }

  // Cắt bỏ chữ "Bearer " để lấy đúng cái mã token
  const token = authHeader.split(" ")[1];

  try {
    // 2. Dùng chữ ký bí mật để giải mã token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);

    // 3. Nếu hợp lệ, nhét thông tin (id, role) vào req để các tầng sau dùng
    req.user = decoded;

    // 4. Cho phép đi tiếp vào Controller
    next();
  } catch (error) {
    // Nếu token sai, bị sửa đổi, hoặc hết hạn (sau 15 phút) thì văng vào đây
    res.status(403).json({
      success: false,
      message: "Token không hợp lệ hoặc đã hết hạn!",
    });
    return;
  }
};
