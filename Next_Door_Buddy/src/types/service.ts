export interface Service {
    id?:number,
    title:string,
    description:string,
    open:boolean,
    asker?:unknown,
    provider?:unknown,
    askerId?:number,
    providerId?:number,
    createdAt:Date
}

