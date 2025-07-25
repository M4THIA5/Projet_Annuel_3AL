import {Sortie} from "#/types/sortie"

export type UserProfile = {
  id: number
  firstName: string
  lastName: string
  email: string
  image: string
  roles: UserRole[]
  latitude?: number
  longitude?: number
  address?: string
  city?: string
  postalCode?: string
  sorties: Sortie[]
} | null

export type Friend = {
  id: number
  firstName: string
  lastName: string
  image?: string
  status: 'accepted' | 'pending' | 'requested' | 'none'
}

export type MultiFriendTypes = {
  friends: Friend[]
  pending: Friend[]
  friend_requests: Friend[]
}

export type User = {
  id: number
  email: string
  firstName?: string | null
  lastName?: string | null
  color: string
  image?: string | null
  latitude?: number | null
  longitude?: number | null
}

export enum userRole {
  admin = "admin",
  classic = "classic"
}

export type  VerifyOtpData  = {
  email: string
  otp: string
}

export type  ResendOtpData = {
  email: string
}

export type UserNeighborhood = {
  id: number
  userId: number
  neighborhoodId: number
  joinedAt: string
  roleInArea: 'admin' | 'classic' | string
  user: {
    id: number
    email: string
    roles: UserRole[]
    refreshToken: string
    firstName: string
    lastName: string
    color: string
    image: string | null
    latitude: number
    longitude: number
    address: string
    city: string
    postalCode: string
    otpCode: string | null
    otpCreatedAt: string | null
    otpVerified: boolean
    resetPasswordCode: string | null
    createdAt: string
    updatedAt: string
  }
}

export type UserRole = keyof typeof userRole


export type ChatUser = {
    userID: string
    username: string
}
