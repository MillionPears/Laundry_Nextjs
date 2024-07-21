import { CreateOrderBodyType, OrderDetailResType, OrderResType } from "../schemaValidations/order.schema"
import http from "../untils/http"



const orderApiRequest = {
  
  orders: (userId: number , sessionToken: string) =>
    http.get<OrderResType>(`/order/getall/bycustomerid/${userId}`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`
      }
    }),
    createOrder: (body: CreateOrderBodyType) =>
      http.post<OrderResType>(`/order/create`,body),
    getOrderDetail: (orderid: number,sessionToken: string) =>
      http.get<OrderDetailResType>(`/orderdetail/getdetail/byorderid/${orderid}`,{
         headers: {
        Authorization: `Bearer ${sessionToken}`
      }
      })
}

export default orderApiRequest