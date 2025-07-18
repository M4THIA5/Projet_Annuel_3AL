import {DemandeTroc, Objet} from "#/types/troc"
import {Card, CardContent, CardHeader, CardTitle} from "#/components/ui/card"
import {Button} from "#/components/ui/button"
import React from "react"
import {UserProfile} from "#/types/user"

type Props = {
    demande: DemandeTroc
    user: UserProfile | undefined
    checkRedirect: (demande:DemandeTroc)=> void
}

export function CardMaker({demande, user, checkRedirect}: Props) {

    const canShowBtn = (!demande.helperId) || (demande.helperId === user?.id && !demande.needsConfirmation) || (demande.userId === user?.id && demande.needsConfirmation)
    const canShowCard = (!demande.helperId && demande.userId !== user?.id) || (demande.helperId === user?.id && !demande.needsConfirmation) || (demande.userId === user?.id && demande.needsConfirmation)
    return canShowCard ? (
        <Card key={demande.id} className="rounded-lg shadow hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">{demande.asker}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center">
                    <p> {demande.objets.length > 0 ? "Troque " +
                        demande.objets.map((obj: Objet) => obj.nom).join(', ') :
                        ""}
                    </p>
                    <p className="mb-4 text-gray-600 text-sm text-center">
                        Souhaite troquer depuis le{" "}
                        <strong>{new Date(demande.createdAt).toLocaleDateString()}</strong>
                    </p>
                    {canShowBtn && (
                        <Button size="sm" type={"button"} onClick={()=>{checkRedirect(demande)}}
                                className="w-full">
                            {(demande.helperId === user?.id) ? "Continuer le troc" : (demande.userId === user?.id && demande.needsConfirmation) ? "Finaliser le troc" : "Accepter le troc"}
                        </Button>)}
                </div>
            </CardContent>
        </Card>
    ) : null
}
