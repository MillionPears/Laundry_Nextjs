import { z } from "zod";

export const Promotion = z.object({
  promotionId: z.number(),
  promotionName: z.string(),
  discountRate: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  //status: z.number().transform((val) => statusMap[val] || "khác"), // Sử dụng object map để chuyển đổi
  status: z.number(),
  staffId: z.number(),
});

export const PromotionRes =z.object({
  data: Promotion,
  message: z.string()
})

export const PromotionsRes = z.object({
  data: z.array(Promotion), // Thay đổi từ z.object() thành z.array(Order)
  message: z.string()
});

export const PromotionCreateBody = z.object({
  promotionName: z.string(),
  discountRate: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  status: z.number(),
  staffId: z.number().optional(),
});


export type CreatePromotionBodyType = z.TypeOf<typeof PromotionCreateBody>
export type UpdatePromotionBodyType = z.TypeOf<typeof PromotionCreateBody>
export type PromotionResType = z.TypeOf<typeof PromotionRes>
export type PromotionsResType = z.TypeOf<typeof PromotionsRes>
