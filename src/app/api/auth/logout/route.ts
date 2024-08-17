'use server'
import { HttpError } from '@/app/untils/http';
import { cookies } from 'next/headers'

export async function POST() {
  
  try {
    cookies().delete('username')
    cookies().delete('sessionToken')
    cookies().delete('userId')
    // cookies().set('username', '', { path: '/', httpOnly: true, maxAge: 0 });
    // cookies().set('sessionToken', '', { path: '/', httpOnly: true, maxAge: 0 });
    return Response.json({
    status:200,
    headers: {
      'Set-Cookie': [
        `username=; Path=/; HttpOnly; Max-Age=0`,
        `sessionToken=; Path=/; HttpOnly; Max-Age=0`,
         `userId=; Path=/; HttpOnly; Max-Age=0`
      ].join(', ')
       
    }
 })
  } catch (error) {
    if(error instanceof HttpError){
        return Response.json(error.payload,{
            status:error.status
        })
    }else {
        return Response.json({
            message: "loi khong xac dinh"
        },{
            status: 500
        })
    }
  }
  
}