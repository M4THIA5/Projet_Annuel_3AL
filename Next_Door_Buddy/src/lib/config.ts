import { userRole } from "#/types/user"
import { jwtDecode, JwtPayload } from "jwt-decode"

export const ACCESS_TOKEN_NAME = 'accessToken'
export const REFRESH_TOKEN_SECRET = "refreshToken"
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
export const NODE_ENV = process.env.NODE_ENV || "development"
export const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000"

export const NEXT_PUBLIC_MAPBOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_API_KEY || "pk.eyJ1Ijoid2F5a29lIiwiYSI6ImNtYmUwbnR2ajIxZzgybnM2cTdudDYwaGgifQ.caKqkcYVeiWLtpuf3VLoVA"
export const SMTP = {
  HOST: process.env.SMTP_HOST || "smtp.ionos.fr",
  PORT: Number(process.env.SMTP_PORT) || 465,
  USER: process.env.SMTP_USER,
  PASS: process.env.SMTP_PASS,
  FROM: process.env.SMTP_FROM
}

export const isTokenValid = (token: string): boolean => {
  try {
    const decodedToken = jwtDecode<JwtPayload>(token)
    const currentTime = Date.now() / 1000 // Convert to seconds
    return decodedToken.exp ? decodedToken.exp > currentTime : false
  } catch (error) {
    console.error("Error decoding token:", error)
    return false
  }
}

export const isAdmin = (token?: string): boolean => {
  if (!token) {
    return false
  }
  try {
    const decodedToken = jwtDecode<JwtPayload & { roles?: string[] }>(token)
    return decodedToken.roles ? decodedToken.roles.includes(userRole.admin) : false
  } catch (error) {
    console.error("Error decoding token:", error)
    return false
  }
}

export const getUserIdFromJwt = (token?: string): number | null => {
  if (!token) {
    return null
  }
  try {
    const decodedToken = jwtDecode<JwtPayload & { userId?: number }>(token)
    return decodedToken.userId ?? null
  } catch (error) {
    console.error("Error decoding token:", error)
    return null
  }
}
