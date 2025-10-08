import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public paths that don't require authentication
  const publicPaths = ["/", "/auth/login", "/auth/register"]
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))

  // API routes that don't require authentication
  const publicApiPaths = ["/api/auth/login", "/api/auth/register", "/api/auth/me"]
  const isPublicApiPath = publicApiPaths.some((path) => pathname.startsWith(path))

  if (isPublicPath || isPublicApiPath) {
    return NextResponse.next()
  }

  // Check authentication for protected routes
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // For now, just check if token exists (JWT verification will be done in API routes)
  // This avoids the Edge Runtime crypto module issue
  
  if (pathname.startsWith("/api/")) {
    const response = NextResponse.next()
    // We'll verify the token in the API route itself
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
