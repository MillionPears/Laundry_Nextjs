import { z } from "zod";

export const Invoice = z.object({
  orderId: z.number(),
  invoiceId: z.number(),
  totalPrice: z.number(),
  createdDate: z.string(),
  paymentStatus: z.number()
});

export const InvoiceRes =z.object({
  data: Invoice,
  message: z.string()
})

export const InvoicesRes = z.object({
  data: z.array(Invoice), // Thay đổi từ z.object() thành z.array(Order)
  message: z.string()
});

export type InvoicesResType = z.TypeOf<typeof InvoicesRes>

export type invoiceResType = z.TypeOf<typeof InvoiceRes>