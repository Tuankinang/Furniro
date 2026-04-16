import * as userService from "../services/user.service";
import { catchAsync } from "../utils/catchAsync";

export const getAllUsers = catchAsync(async (req, res) => {
  const { page, limit, search } = req.query;
  const result = await userService.getAllUsers({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    search: search as string,
  });
  res.status(200).json({ success: true, ...result });
});

export const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (req.user?.id === id) {
    throw new Error("Không thể tự xóa tài khoản của chính mình");
  }

  await userService.deleteUser(id);
  res.status(200).json({ success: true, message: "Xóa tài khoản thành công" });
});
