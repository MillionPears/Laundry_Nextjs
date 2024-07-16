
import { UserResType } from '../schemaValidations/auth.schema'
import { ProfileResType, UpdateProfileBodyType } from '../schemaValidations/profile.schema'
import http from '../untils/http'

const profileApiRequest = {

  profile: (username: string,sessionToken: string) =>
    http.get<ProfileResType>(`/customer/getbyId/${username}`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`
      }
    }),
  userinfo: (sessionToken: string) =>
    http.get<UserResType>()
  profileClient: (id:number) => http.get<ProfileResType>(`/customer/getbyId/${id}`),
  updateProfile: (id: number, body: UpdateProfileBodyType) =>
    http.put<ProfileResType>(`/customer/update/${id}`, body),
}

export default profileApiRequest
