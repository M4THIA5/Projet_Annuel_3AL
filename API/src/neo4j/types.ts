export type UserProperties = {
  userId: number
  email: string
}

export interface FriendsResult {
  friends: UserProperties[]
  pending: UserProperties[]
  friend_requests: UserProperties[]
}

export enum neoRelations {
  friends = "FRIENDS"
}

export type NeoRelations = keyof typeof neoRelations