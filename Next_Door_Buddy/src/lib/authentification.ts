"use server"

import { refreshToken } from "#/lib/api_requests/auth"
import { ACCESS_TOKEN_NAME, isTokenValid, REFRESH_TOKEN_SECRET } from "#/lib/config"
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

  if (cookie?.value && isTokenValid(cookie.value)) {
    return cookie.value
  }

  const { accessToken } = await refreshToken(await getRefreshToken())
  return accessToken
}

export const getRefreshToken = async (): Promise<string | undefined> => {
  const cookieStore = await nextCookies()
  const cookie = cookieStore.get(REFRESH_TOKEN_SECRET)

  return cookie ? cookie.value : undefined
}

export const deleteTokens = async (): Promise<void> => {
  const cookieStore = await nextCookies()
  cookieStore.delete(ACCESS_TOKEN_NAME)
  cookieStore.delete(REFRESH_TOKEN_SECRET)
}
