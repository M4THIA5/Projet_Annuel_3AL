

export type Objet = {
    id: number
    nom: string
    description: string
    image: string
    TrocId?: string
    userId: number
}

export type DemandeTroc = {
    id: number,
    asker: string,
    createdAt: Date,
    userId: number,
    objets: Objet[],
    helperId: number,
    needsConfirmation: boolean,
}

