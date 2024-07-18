import { LoginBodyType, LoginResType, RegisterBodyType, RegisterResType, RoleResType } from "../schemaValidations/auth.schema";
import http from "../untils/http";

const authApiRequest={
    auth: (body: {sessionToken: string, username: string})=> http.post('/api/auth', body,{
        baseUrl: ''
    }),
    register: (body: RegisterBodyType) => http.post<RegisterResType>('/user/register',body),
    login: (body: LoginBodyType) => http.post<LoginResType>('/user/login',body),
    roleid: (username: string,sessionToken: string) => http.get<RoleResType>(`/user/getroleid/byusername/${username}`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`
      }
    })    
}
export default authApiRequest