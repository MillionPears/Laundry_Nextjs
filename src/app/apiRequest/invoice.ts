import { InvoicesResType } from "../schemaValidations/invoice.schema"
import http from "../untils/http"

const invoiceApiRequest = {
    getAll:(sessionToken: string)  =>
      http.get<InvoicesResType>(`/invoice/getall`,{
        headers: {
        Authorization: `Bearer ${sessionToken}`
      }
      }),
    updateStatus: (invoiceId: number)=>
        http.put<InvoicesResType>(`/invoice/update/status/${invoiceId}`,null),
}
export default invoiceApiRequest