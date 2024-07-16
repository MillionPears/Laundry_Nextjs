import { LoginBodyType, LoginResType, RegisterBodyType, RegisterResType } from "../schemaValidations/auth.schema";
import http from "../untils/http";

const authApiRequest={
    auth: (body: {sessionToken: string})=> http.post('/api/auth', body,{
        baseUrl: ''
    }),
    register: (body: RegisterBodyType) => http.post<RegisterResType>('/user/register',body),
    login: (body: LoginBodyType) => http.post<LoginResType>('/user/login',body)
    
}
export default authApiRequest