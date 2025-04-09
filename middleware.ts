import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const isAuthenticated = !!token

  // Get the pathname of the request
  const pathname = req.nextUrl.pathname

  // If the user is not authenticated and is trying to access a protected route
  if (!isAuthenticated && pathname.startsWith("/dashboard")) {
    const url = new URL(`/login`, req.url)
    url.searchParams.set("callbackUrl", encodeURI(pathname))
    return NextResponse.redirect(url)
  }

  // If the user is authenticated and is trying to access auth pages
  if (isAuthenticated && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
}

