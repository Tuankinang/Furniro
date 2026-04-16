import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Tên là bắt buộc" })
      .min(2, "Tên phải có ít nhất 2 ký tự"),
    email: z
      .string({ message: "Email là bắt buộc" })
      .email("Định dạng email không hợp lệ (VD: abc@gmail.com)"),
    password: z
      .string({ message: "Mật khẩu là bắt buộc" })
      .min(6, "Mật khẩu phải dài ít nhất 6 ký tự"),
  }),
});

// Quy tắc cho Form Đăng nhập
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ message: "Email là bắt buộc" })
      .email("Định dạng email không hợp lệ"),
    password: z
      .string({ message: "Mật khẩu là bắt buộc" })
      .min(6, "Mật khẩu không được để trống"),
  }),
});
