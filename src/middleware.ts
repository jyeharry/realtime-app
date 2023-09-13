import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  async (req) => {
    const path = req.nextUrl.pathname

    const isAuth = await getToken({ req })
    const isLoginPath = path.startsWith('/login')

    const sensitiveRoutes = ['/dashboard']
    const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
      path.startsWith(route),
    )

    if (isLoginPath) {
      return isAuth
        ? NextResponse.redirect(new URL('/dashboard', req.url))
        : NextResponse.next()
    }

    if (!isAuth && isAccessingSensitiveRoute) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    if (path === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  },
  {
    callbacks: {
      async authorized() {
        return true
      },
    },
  },
)

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*'],
}
