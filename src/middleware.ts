import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Protect /studio route in production
  if (request.nextUrl.pathname.startsWith('/studio')) {
    // In production, redirect to home (studio should be accessed via sanity.studio)
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    // In development, allow access
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/studio/:path*',
}
