import { CreatePromotionBodyType, PromotionResType, PromotionsResType, UpdatePromotionBodyType } from "../schemaValidations/promotion.schema"
import http from "../untils/http"


const promotionApiRequest = {
   getAll:(sessionToken: string)  =>
      http.get<PromotionsResType>(`/promotion/getall`,{
        headers: {
        Authorization: `Bearer ${sessionToken}`
      }
      }),
    createPromotion: (body: CreatePromotionBodyType) =>
      http.post<PromotionResType>(`/promotion/create`,body),
    updateStatusActive:(status:number, promotionId:number) =>
      http.put<PromotionResType>(`/promotion/update/status/${status}/byid/${promotionId}`, null),
    getById:( promotionId:number,sessionToken:string) =>
      http.get<PromotionResType>(`/promotion/${promotionId}`,{
        headers: {
        Authorization: `Bearer ${sessionToken}`
      }
      }),
      updatePromotion: (promotionId: number, body: UpdatePromotionBodyType) =>
        http.put<PromotionResType>(`/promotion/update/${promotionId}`, body),

}

export default promotionApiRequest