import React from "react"
import {Card, CardContent, CardHeader, CardTitle} from "#/components/ui/card"
import {Button} from "#/components/ui/button"
import {DemandeTroc, Objet} from "#/types/troc"
import Image from "next/image"


const TrocDashboard = ({
                           objets,
                           demandes,
                           onVoir,
                           onModifier,
                           onSupprimer,
                           onCreerObjet,
                           onAccepterTroc,
                            onCreerTroc
                       }: {
    objets: Objet[] | undefined
    demandes: DemandeTroc[] | undefined
    onVoir: (id: number) => void
    onModifier: (id: number) => void
    onSupprimer: (id: number) => void
    onCreerObjet: () => void
    onCreerTroc: () => void
    onAccepterTroc: (id: number) => void
}) => {
    if (!objets || !demandes) return <></>
    return (
        <div className="flex flex-row gap-6 p-4">
            {/* Mes objets */}
            <div className="flex-1 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Mes objets</h2>
                    <Button onClick={onCreerObjet}>Créer un objet</Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {objets.map((objet) => (
                        <Card key={objet.id}>
                            <CardHeader>
                                <CardTitle>{objet.nom}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Image src={objet.image} alt={`image of ${objet.nom}`} width={200} height={200}/>
                                <p className="mb-4">
                                    {objet.description.length > 50 ?
                                        objet.description.substring(0, 50) + '...'
                                        : objet.description}
                                </p>
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={() => onVoir(objet.id)}>Voir</Button>
                                    <Button size="sm" variant="secondary"
                                            onClick={() => onModifier(objet.id)}>Modifier</Button>
                                    <Button size="sm" variant="destructive"
                                            onClick={() => onSupprimer(objet.id)}>Supprimer</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Demandes de troc */}
            <div className="flex-1 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Demandes de troc</h2>
                    <Button onClick={onCreerTroc}>Créer une demande</Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {demandes.map((demande) => (
                        <Card key={demande.id}>
                            <CardHeader>
                                <CardTitle>{demande.asker}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4">Souhaite troquer depuis
                                    le <strong>{demande.createdAt.toString()}</strong></p>
                                <Button size="sm" onClick={() => onAccepterTroc(demande.id)}>Accepter le troc</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TrocDashboard
