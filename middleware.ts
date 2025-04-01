import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key')

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/api/auth/login') ||
    pathname.startsWith('/api/auth/signup') ||
    pathname.startsWith('/api-doc')
  ) {
    return NextResponse.next()
  }

  const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.split(' ')[1]

  if (!token) {
    return NextResponse.json(
      { status: 401, message: 'Missing token' },
      { status: 401 }
    )
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)

    return NextResponse.next()
  } catch (error) {

    return NextResponse.json(
      { status: 403, message: 'Invalid token' },
      { status: 403 }
    )
  }
}

export const config = {
  matcher: [
    '/api/movies/:path*',
    '/api/movies/comments/:path*',
    '/api/movies/theaters/:path*'
  ]
}