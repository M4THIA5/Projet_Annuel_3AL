export type UserProfile = {
  id: string
  firstName: string
  lastName: string
  email: string
  roles: UserRole[]
}


export enum userRole {
  admin = "admin",
  classic = "classic"
}

export type UserRole = keyof typeof userRole
