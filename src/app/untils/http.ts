import envConfig from "@/config"
import { LoginResType } from "../schemaValidations/auth.schema"
import { redirect } from "next/navigation"


type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string | undefined
}

const AUTHENTICATION_ERROR_STATUS = 401
export class HttpError extends Error {
  status: number
  payload: {
    message: string
    [key: string]: any
  }
  constructor({ status, payload }: { status: number; payload: any }) {
    super('Http Error')
    this.status = status
    this.payload = payload
  }
}

class SessionToken{
    private token=''
    get value(){
        return this.token
    }
    set value(token:string){
        // nếu gọi method này ở server thì sẽ bị lỗi
        if(typeof window ==='undefined'){
            throw new Error('Cannot token on server side')
        }
        this.token=token
        //console.log('clientSessionToken set to:', this.token)  // In ra giá trị của token khi được set
   
    }
}

export const clientSessionToken=new SessionToken()
//console.log('clientSessionToken set to 2:', clientSessionToken.value)

const request = async<Response> (
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    options?:CustomOptions | undefined)=>{
    const body = options?.body?JSON.stringify(options.body):undefined
    const baseHeaders={
        'Content-Type':'application/json',
        Authorization : clientSessionToken.value ? `Bearer ${clientSessionToken.value}` : ''
    }
    // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server

    const baseUrl = options?.baseUrl === undefined?envConfig.NEXT_PUBLIC_API_ENDPOINT : options.baseUrl
    const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`
    
    const res = await fetch(fullUrl,{
        ...options,
        headers:{
            ...baseHeaders,
            ...options?.headers
        },
        body,
        method
    })
    const payload: Response = await res.json()
   
    const data ={
        status: res.status,
        payload
    }
    
    if(!res.ok)
    {   
    
        throw new HttpError(data)
    }
    if(typeof window !== 'undefined'){
    if(['/user/login','/user/register'].includes(url)) {
        clientSessionToken.value=(payload as LoginResType).data.token
    }}
    // if(typeof window !== 'undefined'){
    // if(['/user/login','/user/register'].includes(url)) {
        
    // const { token } = (payload as LoginResType).data
    //   clientSessionToken.value = token
    //   localStorage.setItem('sessionToken', token) // Ensure token is also saved in localStorage
    
    // }else if('/user/logout'.includes(url)) {
    //     clientSessionToken.value=''
    // }}
    return data;
 }

    const http={
        get<Response>(url:string,options?:Omit<CustomOptions,'body'> | undefined)
        {
            return request<Response>('GET', url, options)
        },
        post<Response>(
            url: string,
            body: any,
            options?: Omit<CustomOptions, 'body'> | undefined
        ) {
            return request<Response>('POST', url, { ...options, body })
        },
        put<Response>(
            url: string,
            body: any,
            options?: Omit<CustomOptions, 'body'> | undefined
        ) {
            return request<Response>('PUT', url, { ...options, body })
        },
        delete<Response>(
            url: string,
            options?: Omit<CustomOptions, 'body'> | undefined
        ) {
            return request<Response>('DELETE', url, { ...options })
        }
        }


export default http