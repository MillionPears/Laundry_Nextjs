import { z } from "zod";

export const Staff = z.object({
  id: z.number(),
  name: z.string(),
  position: z.string(),
  email: z.string(),
  phoneNumber: z.string(), // Sử dụng object map để chuyển đổi,
  avatar: z.union([z.string(), z.null()]),
  username: z.string(),
  status: z.number()
});

export const StaffRes =z.object({
  data: Staff,
  message: z.string()
})

export const StaffsRes = z.object({
  data: z.array(Staff), // Thay đổi từ z.object() thành z.array(Order)
  message: z.string()
});

export const Positions = [
  "Nhân viên Tiếp nhận",
  "Nhân viên Giặt",
  "Nhân viên Là ủi",
  "Nhân viên Giao nhận",
  "Quản lý Cửa hàng",
  "Nhân viên Kế toán",
  
] as const;
export type PositionType = typeof Positions[number];

// Define the schema for creating a staff member
export const StaffCreateBody = z.object({
  name: z.string(),
  position: z.enum(Positions),
  email: z.string().email(),
  phoneNumber: z.string(),
  avatar: z.union([z.string().url(), z.null()]),
  username: z.string(),
  status: z.number().int().nonnegative(),
  
});

export const RegisterAccountBody = z.object({
  username: z.string(),
  password: z.string().min(6),
  role: z.number(),
active: z.boolean(),

})

export type RegisterAccountBodyType = z.TypeOf<typeof RegisterAccountBody>
export type StaffCreateBodyType = z.TypeOf<typeof StaffCreateBody>

export type StaffsResType = z.TypeOf<typeof StaffsRes>

export type StaffResType = z.TypeOf<typeof StaffRes>