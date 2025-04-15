export interface UserCreated {
  id?: number
  nom: string
  email: string
  prenom:string
  password:string
}

export interface Data {
    id?: number
    data: string
}

export interface Credentials {
    email:string
    password:string
}
/** Schema description defined by JSDoc */
export interface Book {
    /** Field description defined by JSDoc
     *
     * @example 14
     */
    id: number
    title: string
    description?: string
}
export interface User {
  id?: number
  name: string
  email: string
  password: string
  isAdmin?: boolean
}
