"use server"

import { cookies } from "next/headers"
import { refreshToken } from "./api_requests/auth"
import { ACCESS_TOKEN_NAME, isTokenValid, REFRESH_TOKEN_SECRET } from "./config"

export const isAuthenticated = async (): Promise<boolean> => {
  const cookieStore = await cookies()
  const jwt = cookieStore.get(REFRESH_TOKEN_SECRET)
  const accessToken = cookieStore.get(ACCESS_TOKEN_NAME)
  if (!jwt || !isTokenValid(jwt.value)) {
    return false
  }

  if (!accessToken || !isTokenValid(accessToken.value)) {
    const response = await refreshToken()
    console.log("Response from refreshToken:", response)

    if (!response || !response.ok || response.status !== 200) {
      return false
    }
    const accessToken = await response.json()
    if (!accessToken) {
      return false
    }

  }
  return true
}
