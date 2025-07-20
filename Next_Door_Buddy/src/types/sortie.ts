import {UserProfile} from "#/types/user"

export type Sortie = {
    id:number
    title:string
    description:string
    open:boolean
    ended:boolean
    createdAt:unknown
    date:string
    address:string
    creatorId?:number
    creator:UserProfile
    participants?:UserProfile[]
    maxParticipants: number
}
