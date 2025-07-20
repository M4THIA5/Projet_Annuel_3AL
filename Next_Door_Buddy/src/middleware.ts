import { isAuthenticated } from "#/lib/authentification"
import { Routes } from "#/Routes"
import { NextRequest, NextResponse } from "next/server"
import { getUserIdFromJwt, isAdmin } from "./lib/config"
import { getNeighborhoodsOfUser } from "./lib/api_requests/neighborhood"

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

  const refreshToken = req.cookies.get('refreshToken')?.value
  const userId = getUserIdFromJwt(refreshToken)
  if (isAuth && isPublicRoute && userId) {

    const neighborhoods = await getNeighborhoodsOfUser(userId)
    if (neighborhoods.length > 0) {
      return NextResponse.redirect(new URL(Routes.neighborhood.id.toString(String(neighborhoods[0].id)), req.url))
    }
    return NextResponse.redirect(new URL(Routes.neighborhood.toString(), req.url))
  }

  if (isAuth && isAdminRoute) {
    const refreshToken = req.cookies.get('refreshToken')?.value

    if (!isAdmin(refreshToken) && userId) {
      const neighborhoods = await getNeighborhoodsOfUser(userId)
      if (neighborhoods.length > 0) {
        return NextResponse.redirect(new URL(Routes.neighborhood.id.toString(String(neighborhoods[0].id)), req.url))
      }
      return NextResponse.redirect(new URL(Routes.neighborhood.toString(), req.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
