import { z } from "zod";

const statusMap: Record<number, string> = {
  0: "không hoạt động",
  1: "đang hoạt động",
  // Bạn có thể thêm các giá trị khác nếu cần
};

export const Service = z.object({
  serviceId: z.number(),
  serviceName: z.string(),
  description: z.string(),
  price: z.number(),
  status: z.number(), // Sử dụng object map để chuyển đổi,
  promotionId: z.union([z.number(), z.null()]),
  staffId: z.number()
});

export const ServiceRes =z.object({
  data: Service,
  message: z.string()
})

export const ServicesRes = z.object({
  data: z.array(Service), // Thay đổi từ z.object() thành z.array(Order)
  message: z.string()
});

export const ServiceUpdatePromotion = z.object({
 
serviceIds: z.array(z.number())
 
});

export const ServiceCreateBody = z.object({
  serviceName: z.string(),
  description:  z.union([z.string(), z.null()]),
  price: z.number(),
  status: z.number(), // Sử dụng object map để chuyển đổi,
  promotionId: z.union([z.number(), z.null()]),
  staffId: z.number()
});

export type ServiceUpdateBody = z.TypeOf<typeof Service>
export type ServiceCreateBodyType = z.TypeOf<typeof ServiceCreateBody>
export type ServiceUpdatePromotionType = z.TypeOf<typeof ServiceUpdatePromotion>
export type ServicesResType = z.TypeOf<typeof ServicesRes>

export type ServiceResType = z.TypeOf<typeof ServiceRes>