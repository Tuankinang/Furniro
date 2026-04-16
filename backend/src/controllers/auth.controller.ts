import * as authService from "../services/auth.service";
import prisma from "../config/prisma";
import { catchAsync } from "../utils/catchAsync";

export const register = catchAsync(async (req, res) => {
  const newUser = await authService.register(req.body);
  const { password, ...data } = newUser;
  res.status(201).json({ success: true, message: "Đăng ký thành công!", data });
});

export const login = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  const { password, refreshToken: _, ...data } = user;
  res.status(200).json({ success: true, accessToken, data });
});

export const getProfile = catchAsync(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, role: true },
  });
  res.status(200).json({ success: true, data: user });
});

export const refreshToken = catchAsync(async (req, res) => {
  const { newAccessToken, newRefreshToken } = await authService.refreshToken(
    req.cookies.refreshToken,
  );
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.status(200).json({ success: true, accessToken: newAccessToken });
});

export const logout = catchAsync(async (req, res) => {
  await authService.logout(req.cookies.refreshToken);
  res.clearCookie("refreshToken");
  res.status(200).json({ success: true, message: "Đã đăng xuất" });
});
