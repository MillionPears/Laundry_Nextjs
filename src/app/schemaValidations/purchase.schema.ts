import { z } from "zod";

export const Purchase = z.object({
  purchaseId: z.number(),
  dateCreate: z.string(),
  staffId: z.number(),
});

export const PurchaseRes =z.object({
  data: Purchase,
  message: z.string()
})

export const PurchasesRes = z.object({
  data: z.array(Purchase), // Thay đổi từ z.object() thành z.array(Order)
  message: z.string()
});

export const PurchaseDetail= z.object({
id:z.object({
  purchaseId: z.number(),
  goodsId: z.number(),
}),
goodsName: z.string(),
amount: z.number(),
priceIncome: z.number()
})
export const PurchaseDetailRes = z.object({
  data: z.array(PurchaseDetail), // Thay đổi từ z.object() thành z.array(Order)
  message: z.string()
});

export const createPurchaseDetailBody = z.object({
 id:z.object({
  purchaseId: z.number(),
  goodsId: z.number(),
}),
  amount: z.number(),
priceIncome: z.number()
})
// export const createPurchaseDetailBody = z.object({
//   data: z.array(createPurchase), // Thay đổi từ z.object() thành z.array(Order)
  
// });
export type PurchasesCreateType = z.TypeOf<typeof createPurchaseDetailBody>
export type PurchasesResType = z.TypeOf<typeof PurchasesRes>

export type PurchaseResType = z.TypeOf<typeof PurchaseRes>
export type PurchaseDetailResType = z.TypeOf<typeof PurchaseDetailRes>