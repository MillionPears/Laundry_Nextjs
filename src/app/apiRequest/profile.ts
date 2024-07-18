


import { CustomerResType, StaffResType } from '../schemaValidations/auth.schema'
import { ProfileResType, UpdateProfileBodyType } from '../schemaValidations/profile.schema'
import http from '../untils/http'

const profileApiRequest = {
  
  profile: (username: string | undefined,sessionToken: string) =>
    http.get<ProfileResType>(`/customer/getbyId/${username}`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`
      }
    }),
  customerProfile: (username:string,sessionToken: string) => http.get<CustomerResType>(`/customer/getbyusername/${username}`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`
      }
    }),
  staffProfile: (username:string,sessionToken: string) => http.get<StaffResType>(`/staff/getbyusername/${username}`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`
      }
    }),
  updateProfile: (id: number, body: UpdateProfileBodyType) =>
    http.put<ProfileResType>(`/customer/update/${id}`, body),
  profileClient: (username:string) => http.get<ProfileResType>(`/user/getbyusername/${username}`),

}

export default profileApiRequest
