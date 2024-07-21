'use server'
import { HttpError } from '@/app/untils/http';
import { cookies } from 'next/headers'

export async function POST() {

//   const cookieStore = cookies();
//   const sessionToken = cookieStore.get("sessionToken")
//   const username = cookieStore.get("username")
  
//  if (!sessionToken) {
    
//     return Response.json(
//       { message: 'Không nhận được session token' },
//       {
//         status: 401
//       }
//     )
//   }
//   if (!username) {
    
//     return Response.json(
//       { message: 'Không nhận được username' },
//       {
//         status: 401
//       }
//     )
//   }

  try {
    cookies().delete('username')
    cookies().delete('sessionToken')
    // cookies().set('username', '', { path: '/', httpOnly: true, maxAge: 0 });
    // cookies().set('sessionToken', '', { path: '/', httpOnly: true, maxAge: 0 });
    return Response.json({
    status:200,
    headers: {
      'Set-Cookie': [
        `username=; Path=/; HttpOnly; Max-Age=0`,
        `sessionToken=; Path=/; HttpOnly; Max-Age=0`
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