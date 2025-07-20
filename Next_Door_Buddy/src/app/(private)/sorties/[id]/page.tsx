"use client"
import {acceptRequest, getSortieById, deleteRequest} from "#/lib/api_requests/sorties"
import {Button} from "#/components/ui/button"
import {getProfile} from "#/lib/api_requests/user"
import {Card, CardContent, CardHeader, CardTitle} from "#/components/ui/card"
import {useEffect, useState} from "react"
import {Sortie} from "#/types/sortie"
import {UserProfile} from "#/types/user"


async function acceptReq(id: string): Promise<void> {
    await acceptRequest(id)
}

async function deleteReq(id: string): Promise<void> {
    await deleteRequest(id)
}

function update(id: string): void {
    window.location.href = `/sorties/${id}/update`
}

export default function SpecificSortie({params}: { params: Promise<{ id: string }> }) {

    const [sortie, setSortie] = useState<Sortie>({
        address: "",
        createdAt: undefined,
        creator: null,
        creatorId: 0,
        date: "",
        description: "",
        ended: false,
        id: 0,
        maxParticipants: 0,
        open: false,
        participants: undefined,
        title: ""
    })
    const [user, setUser] = useState<UserProfile | undefined>()
    const [isAccepted, setIsAccepted] = useState(false)

    useEffect(() => {
        async function fyegf() {
            const id = (await params).id
            const sortie = await getSortieById(Number.parseInt(id))
            const user = await getProfile()
            setSortie(sortie)
            setUser(user)
            if (!user) return
            if (user.sorties?.some(s => s.id === sortie.id)) {
                setIsAccepted(true)
            }
        }

        fyegf()
    }, [params])

    const isOwner = user?.id === sortie.creatorId

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <Card className="border rounded-2xl shadow-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold">{sortie.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-gray-700 whitespace-pre-wrap">{sortie.description}</p>
                    <div>
                        <strong>
                            Participants:
                        </strong>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {sortie.participants?.length ? (
                            sortie.participants.map((participant) => (
                                <span key={participant ? participant.id:""}>
                                    {participant ? participant.firstName:""} {participant ? participant.lastName:""}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-500">Aucun participant</span>
                        )}
                    </div>
                    <div>
                        <strong>Date
                            :</strong> {sortie.date ? new Date(sortie.date).toLocaleDateString() : "Non définie"}
                    </div>
                    <div>
                        <strong>Adresse :</strong> {sortie.address || "Non définie"}
                    </div>
                    <div>
                        <strong>Créateur
                            :</strong> {sortie.creator ? `${sortie.creator.firstName} ${sortie.creator.lastName}` : "Inconnu"}
                    </div>
                    <div><strong>
                        Nombre de participants maximum :
                    </strong> {sortie.maxParticipants || "Non défini"}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                        {!isOwner && !isAccepted && (
                            <Button
                                variant="default"
                                onClick={async () => acceptReq((await params).id)}
                            >
                                Accepter la demande
                            </Button>
                        )}

                        {isOwner && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={async () => update((await params).id)}
                                >
                                    Modifier la sortie
                                </Button>

                                <Button
                                    variant="destructive"
                                    onClick={async () => deleteReq((await params).id)}
                                >
                                    Supprimer la sortie
                                </Button>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
