import { MessageResType } from "../schemaValidations/auth.schema"
import { RegisterAccountBodyType, StaffCreateBodyType, StaffResType, StaffsResType } from "../schemaValidations/staff.schema"
import http from "../untils/http"

const staffApiRequest ={
    getAll: (sessionToken: string)  =>
      http.get<StaffsResType>(`/staff/list/all`,{
        headers: {
        Authorization: `Bearer ${sessionToken}`
      }
      }),
      createStaff:(body: StaffCreateBodyType) =>
        http.post<StaffResType>("/staff/create",body),
      registerAccount: (body: RegisterAccountBodyType)=>
        http.post<MessageResType>("/user/register",body),
      updateById: ( body: StaffCreateBodyType,id: number) =>
        http.put<StaffResType>(`/staff/update/${id}`,body)

}

export default staffApiRequest