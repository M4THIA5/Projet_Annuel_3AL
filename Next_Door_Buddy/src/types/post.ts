

export type Post = {
    _id: string
    content: string
    createdAt: string
    neighborhoodId: string
    userId: string
    type: string
    images: string[]
    updatedAt: string[]
    user: {
        email : string,
        color : string,
        image : string,
        firstName : string,
        lastName : string,
    }
}
