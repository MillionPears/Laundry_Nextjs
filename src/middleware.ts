import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import authApiRequest from './app/apiRequest/auth'

const authPaths = ['/login', '/pages/register']
const adminPath = '/admin'
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionToken = request.cookies.get('sessionToken')?.value
  const username = request.cookies.get("username")?.value;
  let isStaff = false;
   if (username && sessionToken){
  const roleData = await authApiRequest.roleid(
        username,
        sessionToken
      );
      if (roleData.payload.data !== 1) {
    isStaff=true;
  }
  }
  
  // Nếu chưa đăng nhập và đường dẫn không phải là /login hoặc /register
  if (!sessionToken && pathname !== '/' && !authPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if(sessionToken){
    if(isStaff){
      // Không cho phép truy cập vào trang chính (/)
      if (pathname === '/') {
        return NextResponse.redirect(new URL(adminPath, request.url))
      }
     
      // Không cho phép truy cập vào các trang authPaths
      if (authPaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL(adminPath, request.url))
      }
    }else{
      
      // Nếu không ở trang admin
      // Không Cho phép truy cập vào các trang authPaths và trang chính (/)
      // Nhưng nếu truy cập vào trang admin từ các đường dẫn khác, chuyển hướng về trang chính
      if (pathname.startsWith(adminPath)) {
        
        return NextResponse.redirect(new URL('/', request.url))
      }
      if (authPaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }
  

  // Tiếp tục với các yêu cầu khác
  return NextResponse.next()
}

// Cấu hình matcher để áp dụng middleware cho tất cả các đường dẫn
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
