'use server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const res = await request.json()
  const sessionToken = res.sessionToken as string
  const userId = res.userId as string
  
  const username = res.username as string
  cookies().set('username', username)
  cookies().set('userId', String(userId))
 if (!sessionToken) {
    return Response.json(
      { message: 'Không nhận được session token' },
      {
        status: 400
      }
    )
  }
 return Response.json({res},{
    status:200,
    headers: {
        'Set-Cookie':`sessionToken=${sessionToken}; Path=/ `
       
    }
 })
}