import { z } from "zod";
import { CustomerRes } from "./auth.schema";
export const Customer = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  email: z.string(),
  phoneNumber: z.string(), // Sử dụng object map để chuyển đổi,
  avatar: z.union([z.string(), z.null()]),
  username: z.string(),
  hobbie: z.string()
});

export const StaffRes =z.object({
  data: Customer,
  message: z.string()
})
export const CustomerCreateBody = z.object({
  name: z.string(),
  address: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  avatar: z.union([z.string().url(), z.null()]),
  username: z.string(),
  hobbie: z.string()
  
});

export const RegisterAccountBody = z.object({
  username: z.string(),
  password: z.string().min(6),
  role: z.number()

})

export type RegisterAccountBodyType = z.TypeOf<typeof RegisterAccountBody>
export type CustomerCreateBodyType = z.TypeOf<typeof CustomerCreateBody>
export type CustomerResType = z.TypeOf<typeof CustomerRes>