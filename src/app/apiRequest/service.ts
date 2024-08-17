
import { ServiceCreateBodyType, ServiceResType, ServicesResType, ServiceUpdateBody, ServiceUpdatePromotionType } from "../schemaValidations/service.schema"

import http from "../untils/http"


const serviceApiRequest = {
  getAllByStatus:(status:number,sessionToken: string)  =>
      http.get<ServicesResType>(`/service/getall/bystatus/${status}`,{
        headers: {
        Authorization: `Bearer ${sessionToken}`
      }
      }),
  updatePromotionForServices: (id: number, body: {serviceIds: number[]})  =>
    http.put<ServicesResType> (`/service/update/promotionid/${id}/forservices`,body),
  getByPromotionId:(promotionId: number, sessionToken:string)=>
    http.get<ServicesResType>(`/service/getall/bypromotionid/${promotionId}`,{
        headers: {
        Authorization: `Bearer ${sessionToken}`
      }
      }),
  getAll: (sessionToken: string)  =>
      http.get<ServicesResType>(`/service/getall`,{
        headers: {
        Authorization: `Bearer ${sessionToken}`
      }
      }),
  createService:(body: ServiceCreateBodyType) =>
    http.post<ServiceResType>("/service/create",body),
  updateService:(body: ServiceUpdateBody, serviceId:number) =>
    http.put<(ServiceResType)>(`/service/update/${serviceId}`,body)
}

export default serviceApiRequest