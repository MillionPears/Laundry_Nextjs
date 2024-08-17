import { RegisterResType } from "../schemaValidations/auth.schema"
import { MessageResType } from "../schemaValidations/common.schema"
import { CustomerCreateBodyType, CustomerResType, RegisterAccountBodyType } from "../schemaValidations/customer.schema"
import http from "../untils/http"

const customerApiRequest ={
    
      createCustomer:(body: CustomerCreateBodyType) =>
        http.post<CustomerResType>("/customer/create",body),
      registerAccount: (body: RegisterAccountBodyType)=>
        http.post<RegisterResType>("/user/register",body),
      customerClient:  (username:string) => http.get<CustomerResType>(`/customer/getbyusername/${username}`),
    //   updateById: ( body: StaffCreateBodyType,id: number) =>
    //     http.put<StaffResType>(`/staff/update/${id}`,body)

}

export default customerApiRequest