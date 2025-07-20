export const accessTokenExpiration = '4h'
export const refreshTokenExpiration = '7d'

export const refreshTokenName = 'refreshToken'
export const accessTokenName = 'accessToken'

export enum userRole {
  admin = "admin",
  classic = "classic"
}

export type UserRole = keyof typeof userRole
