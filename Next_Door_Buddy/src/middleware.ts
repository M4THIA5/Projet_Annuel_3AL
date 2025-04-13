import { isAuthenticated } from "#/lib/authentification"
import { Routes } from "#/Routes"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const PUBLIC_ROUTES = [
  Routes.login.toString(),
  Routes.register.toString(),
]

export async function middleware(req: NextRequest) {
  const isAuth = await isAuthenticated()
  const isPublicRoute = PUBLIC_ROUTES.some((route) => req.nextUrl.pathname.startsWith(route))

  if (!isAuth && !isPublicRoute) {
    return NextResponse.redirect(new URL(Routes.login.toString(), req.url))
  }
  if (isAuth && isPublicRoute) {
    return NextResponse.redirect(new URL(Routes.home.toString(), req.url))
  }
  return NextResponse.next()
}

export const config = {
  // matcher: [Routes.home.toString(), Routes.login.toString()],
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
