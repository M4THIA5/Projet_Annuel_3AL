import { isAuthenticated } from "#/lib/authentification"
import { Routes } from "#/Routes"
import { NextRequest, NextResponse } from "next/server"
import { isAdmin } from "./lib/config"

const PUBLIC_ROUTES = [
  Routes.auth.login.toString(),
  Routes.auth.register.toString(),
  Routes.auth.verify.toString(),
  Routes.auth.resetPassword.toString(),
]

export async function middleware(req: NextRequest) {
  const isAuth = await isAuthenticated()
  const isPublicRoute = PUBLIC_ROUTES.some((route) => req.nextUrl.pathname.startsWith(route))
  const isAdminRoute = req.nextUrl.pathname.startsWith(Routes.admin.toString())
  if (!isAuth && !isPublicRoute) {
    const pls = req.nextUrl.pathname.replace('/','').length > 0 ? "?return_to="+ req.nextUrl.pathname.replace('/',''): ''
    return NextResponse.redirect(new URL(Routes.auth.login.toString()+pls, req.url))
  }
  if (isAuth && isPublicRoute) {
    return NextResponse.redirect(new URL(Routes.home.toString(), req.url))
  }

  if (isAuth && isAdminRoute) {
    const refreshToken = req.cookies.get('refreshToken')?.value

    if (!isAdmin(refreshToken)) {
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
