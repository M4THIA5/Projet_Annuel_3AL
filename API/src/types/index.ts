export interface User {
  id?: number
  name: string
  email: string
  password: string
  isAdmin?: boolean
}

export type CurrentUser = {
  id: number
  email: string
  isAdmin: boolean
}
