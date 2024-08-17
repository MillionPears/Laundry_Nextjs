import { z } from "zod";

export const Goods = z.object({
  goodsId: z.number(),
  goodsName: z.string(),
  image: z.string(),
  amount: z.number(),
  active: z.boolean(),
  threshold: z.number()
});

export const GoodsRes =z.object({
  data: Goods,
  message: z.string()
})

export const GoodsesRes = z.object({
  data: z.array(Goods), // Thay đổi từ z.object() thành z.array(Order)
  message: z.string()
});

export const GoodsUpdateBody = z.object({
  goodsName: z.string(),
  image: z.string(),
  amount: z.number(),
  active: z.boolean(),
  threshold: z.number()
});

export type GoodsUpdateBodyType = z.TypeOf<typeof GoodsUpdateBody>
export type GoodsesResType = z.TypeOf<typeof GoodsesRes>

export type GoodsResType = z.TypeOf<typeof GoodsRes>