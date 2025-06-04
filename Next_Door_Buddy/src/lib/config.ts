import { jwtDecode, JwtPayload } from "jwt-decode"

export const ACCESS_TOKEN_NAME = 'accessToken'
export const REFRESH_TOKEN_SECRET = "refreshToken"
export const API_URL = process.env.NEXT_PUBLIC_API_URL
export const NODE_ENV = process.env.NODE_ENV || "development"

export const MAPBOX_API_KEY = process.env.NEXT_PUBLIC_API_URL

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
