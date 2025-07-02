import { UserRole } from "../config/utils"

export interface User {
  id?: number
  email: string
  password: string
  roles?: UserRole[]
  refreshToken?: string
  firstName?: string
  lastName?: string
  color?: string
  image?: string
  latitude?: number
  longitude?: number
  address?: string
  city?: string
  postalCode?: string
  otpCode?: string
  otpCreatedAt?: Date
  otpVerified?: boolean
  resetPasswordCode?: string
}

export type CurrentUser = {
  id: number
  email: string
  roles: UserRole[]
}
