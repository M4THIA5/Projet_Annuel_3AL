export type UserProfile = {
  id: string
  firstName: string
  lastName: string
  email: string
  image: string
  roles: UserRole[]
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

export type UserRole = keyof typeof userRole
