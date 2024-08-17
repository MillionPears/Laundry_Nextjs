import { PurchaseDetailResType, PurchaseResType, PurchasesCreateType, PurchasesResType } from "../schemaValidations/purchase.schema"
import http from "../untils/http"


const purchaseApiRequest ={
    getAll:(sessionToken: string)  =>
      http.get<PurchasesResType>(`/purchase/getall`,{
        headers: {
        Authorization: `Bearer ${sessionToken}`
      }
      }),
    getPurchaseDetail: (purchaseId: number) =>
      http.get<PurchaseDetailResType>(`/purchasedetail/getall/bypurchaseid/${purchaseId}`),
    createPurchaseDetail: (body: PurchasesCreateType, staffid: number) =>
      http.post<PurchaseDetailResType>(`/purchasedetail/create/bystaffid/${staffid}`,body),
    getPurchaseDetailServer:(sessionToken: string,purchaseId: number)  =>
      http.get<PurchaseDetailResType>(`/purchasedetail/getall/bypurchaseid/${purchaseId}`,{
        headers: {
        Authorization: `Bearer ${sessionToken}`
      }
      }),

    
}
export default purchaseApiRequest
