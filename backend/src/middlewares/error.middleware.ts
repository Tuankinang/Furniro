import { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("[Lỗi Hệ Thống]:", err.message || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Đã có lỗi xảy ra từ phía máy chủ!";

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};
