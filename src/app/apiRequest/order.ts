import { MessageResType } from "../schemaValidations/auth.schema"
import { CreateOrderBodyType, CreateOrderDetailBodyType, OrderDetailResType, OrderResType, OrdersResType } from "../schemaValidations/order.schema"
import http from "../untils/http"



const orderApiRequest = {
  
  orders: (userId: number , sessionToken: string) =>
    http.get<OrdersResType>(`/order/getall/bycustomerid/${userId}`, {
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
      }),
    getOrdersByStatus:(status:number, sessionToken: string)  =>
      http.get<OrdersResType>(`/order/getall/bystatus/${status}`,{
        headers: {
        Authorization: `Bearer ${sessionToken}`
      }
      }),
     getAll:(sessionToken: string)  =>
      http.get<OrdersResType>(`/order/getall`,{
        headers: {
        Authorization: `Bearer ${sessionToken}`
      }
      }),
      createOrderDetail: (body: CreateOrderDetailBodyType) =>
        http.post<OrderDetailResType>(`/orderdetail/create`,body),
      deleteOrder: (orderId : number) =>
        http.delete<MessageResType>(`/order/delete/${orderId}`),
      updateStatus: (orderId: number, status: number)=>
        http.put<OrderResType>(`/order/update/${orderId}/orderstatus/${status}`,null),
      getListOrderShipment:(sessionToken: string)  =>
      http.get<OrdersResType>(`/order/list/shipment`,{
        headers: {
        Authorization: `Bearer ${sessionToken}`
      }
      }),
      getOrderDetailClient: (orderid: number) =>
      http.get<OrderDetailResType>(`/orderdetail/getdetail/byorderid/${orderid}`),
      updateDeliveryStatus: (orderId: number, status: number)=>
        http.put<OrderResType>(`/order/update/${orderId}/deliverystatus/${status}`,null),
}

export default orderApiRequest