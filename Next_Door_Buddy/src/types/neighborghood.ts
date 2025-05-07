export type Neighborhood = {
  id: number
  name: string
  city?: string
  postalCode?: string
  members: number
  createdAt: Date
  updatedAt?: Date
  description?: string
  image?: Buffer
}
