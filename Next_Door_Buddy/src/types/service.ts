export interface Service {
    id?:number,
    title:string,
    description:string,
    open:boolean,
    asker?:unknown,
    provider?: {
        firstName: string,
        lastName: string,
    },
    askerId?:number,
    providerId?:number,
    createdAt:Date
}

