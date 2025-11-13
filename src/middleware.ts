import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  
  // Add authentication logic here if needed
  // For now, we'll let all requests through
  
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*'
}