import bcrypt from "bcrypt";
import prisma from "../config/prisma"; // Gọi thẳng Prisma
import jwt from "jsonwebtoken";

export const register = async (userData: any) => {
  const { name, email, password } = userData;

  // 1. Kiểm tra email
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("Email này đã được đăng ký!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // 2. Tạo User mới
  return await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });
};

export const login = async (userData: any) => {
  const { email, password } = userData;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Email hoặc mật khẩu không chính xác!");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Email hoặc mật khẩu không chính xác!");
  }

  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: "20m" },
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" },
  );

  // 3. Cập nhật Refresh Token vào DB
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return { user, accessToken, refreshToken };
};

export const refreshToken = async (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string,
    ) as any;
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user || user.refreshToken !== token) {
      throw new Error("Token đã bị thu hồi!");
    }

    const newAccessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: "20m" },
    );

    const newRefreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" },
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    return { newAccessToken, newRefreshToken };
  } catch (error) {
    throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
  }
};

export const logout = async (refreshToken: string) => {
  if (!refreshToken) return;
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string,
    ) as any;
    // Xóa token trong DB
    await prisma.user.update({
      where: { id: decoded.id },
      data: { refreshToken: null },
    });
  } catch (error) {
    // Bỏ qua nếu token lỗi
  }
};
