"use server"

import { refreshToken } from "#/lib/api_requests/auth"
import { ACCESS_TOKEN_NAME, isTokenValid, REFRESH_TOKEN_SECRET } from "#/lib/config"
import { cookies } from "next/headers"

export const isAuthenticated = async (): Promise<boolean> => {
  const refreshTokenValue = await getRefreshToken()
  const accessToken = await getAccessToken()
  if (!refreshTokenValue || !isTokenValid(refreshTokenValue)) {
    return false
  }

  if (!accessToken || !isTokenValid(accessToken)) {
    const { accessToken } = await refreshToken(refreshTokenValue)
    if (!accessToken) {
      return false
    }
  }
  return true
}

export const getAccessToken = async (): Promise<string | undefined> => {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(ACCESS_TOKEN_NAME)
  return cookie ? cookie.value : undefined
}

export const getRefreshToken = async (): Promise<string | undefined> => {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(REFRESH_TOKEN_SECRET)
  return cookie ? cookie.value : undefined
}
