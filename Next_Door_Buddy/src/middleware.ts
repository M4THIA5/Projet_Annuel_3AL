import { isAuthenticated } from "#/lib/authentification"
import { Routes } from "#/Routes"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getRoles } from "./lib/api_requests/user"
import { userRole } from "./types/user"

const PUBLIC_ROUTES = [
  Routes.login.toString(),
  Routes.register.toString(),
]

export async function middleware(req: NextRequest) {
  const isAuth = await isAuthenticated()
  const isPublicRoute = PUBLIC_ROUTES.some((route) => req.nextUrl.pathname.startsWith(route))
  const isAdminRoute = req.nextUrl.pathname.startsWith(Routes.admin.toString())

  if (!isAuth && !isPublicRoute) {
    return NextResponse.redirect(new URL(Routes.login.toString(), req.url))
  }
  if (isAuth && isPublicRoute) {
    return NextResponse.redirect(new URL(Routes.home.toString(), req.url))
  }

  if (isAuth && isAdminRoute) {
    const roles = await getRoles()
    if (!roles.includes(userRole.admin)) {
      return NextResponse.redirect(new URL(Routes.home.toString(), req.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
