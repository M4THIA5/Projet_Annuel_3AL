export const accessTokenExpiration = '10m'
export const refreshTokenExpiration = '2d'

export const refreshTokenName = 'refreshToken'
export const accessTokenName = 'accessToken'

export enum userRole {
  admin = "admin",
  classic = "classic"
}

export type UserRole = keyof typeof userRole
