"use server"

import { refreshToken } from "#/lib/api_requests/auth"
import { ACCESS_TOKEN_NAME, isTokenValid, NODE_ENV, REFRESH_TOKEN_SECRET } from "#/lib/config"
import { cookies as nextCookies } from "next/headers"

export const isAuthenticated = async (): Promise<boolean> => {
  const refreshTokenValue = await getRefreshToken()
  const accessToken = await getAccessToken()
  if (!refreshTokenValue || !isTokenValid(refreshTokenValue)) {
    return false
  }

  if (!accessToken || !isTokenValid(accessToken)) {
    return false
  }
  return true
}

export const getAccessToken = async (): Promise<string | undefined> => {
  const cookieStore = await nextCookies()
  const cookie = cookieStore.get(ACCESS_TOKEN_NAME)

  if (!cookie || !isTokenValid(cookie.value)) {
    const { accessToken } = await refreshToken(await getRefreshToken())

    if (accessToken) {
      cookieStore.set(ACCESS_TOKEN_NAME, accessToken, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: 'lax',
        path: '/',
        maxAge: 10 * 60 * 1000 // 10 minutes
      })
      return accessToken
    }
    return undefined
  }
  return cookie.value
}

export const getRefreshToken = async (): Promise<string | undefined> => {
  const cookieStore = await nextCookies()
  const cookie = cookieStore.get(REFRESH_TOKEN_SECRET)

  return cookie ? cookie.value : undefined
}
