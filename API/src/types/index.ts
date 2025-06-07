import { UserRole } from "../config/utils"

export interface User {
  id?: number
  firstName: string
  lastName: string
  email: string
  color?: string
  password: string
  roles?: UserRole[]
  image?: string
}

export type CurrentUser = {
  id: number
  email: string
  roles: UserRole[]
}
