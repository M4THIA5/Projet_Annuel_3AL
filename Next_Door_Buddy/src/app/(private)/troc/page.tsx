"use client"

import React, {useEffect, useState} from "react"
import {DemandeTroc, Objet} from "#/types/troc"
import {redirect} from "next/navigation"
import {createAcceptionTroc, deleteObjet, getDemandesTroc, getMyItems} from "#/lib/api_requests/troc"
import {Button} from "#/components/ui/button"
import {Card, CardHeader, CardTitle, CardContent} from "#/components/ui/card"
import Image from "next/image"
import {Routes} from "#/Routes"
import {Skeleton} from "#/components/ui/skeleton"
import {getProfile} from "#/lib/api_requests/user"
import {UserProfile} from "#/types/user"
import {CardMaker} from "#/app/(private)/troc/cards"

export default function TrocPage() {
    const [objets, setObjets] = useState<Objet[]>([])
    const [demandes, setDemandes] = useState<DemandeTroc[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<UserProfile | undefined>()

    async function fetchAll() {
        setLoading(true)
        const [objetsData, demandesData, profile] = await Promise.all([
            getMyItems(),
            getDemandesTroc(),
            getProfile()
        ])
        setObjets(objetsData || [])
        setDemandes(demandesData || [])
        setUser(profile)
        setLoading(false)
    }



    useEffect(() => {
        fetchAll()
    }, [])

    const checkRedirect = (demande: DemandeTroc) => {
        if (!demande.helperId) {
            createAcceptionTroc(demande.id).then(redirect(Routes.troc.accept.toString(String(demande.id))))
        } else if (demande.needsConfirmation) {
            redirect(Routes.troc.confirm.toString(String(demande.id)))
        } else {
            redirect(Routes.troc.accept.toString(String(demande.id)))
        }
    }
    const demandesList = demandes.map((demande) => (
        <CardMaker key={demande.id} demande={demande} user={user} checkRedirect={checkRedirect}/>
    ))
    return (
        <div className="flex flex-col lg:flex-row gap-8 p-6 bg-gray-50 min-h-screen">
            {/* Mes objets */}
            <div className="flex-1 bg-white rounded-xl shadow-md p-6 space-y-6">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">Mes objets</h2>
                    <Button onClick={() => redirect(Routes.troc.objet.create.toString())} className="font-medium">
                        Créer un objet
                    </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {loading ? (
                        Array.from({length: 4}).map((_, idx) => (
                            <Card key={idx} className="rounded-lg shadow p-4 space-y-4">
                                <Skeleton className="w-[180px] h-[180px] mx-auto rounded-md"/>
                                <Skeleton className="h-4 w-3/4 mx-auto"/>
                                <Skeleton className="h-4 w-1/2 mx-auto"/>
                                <div className="flex justify-center gap-2">
                                    <Skeleton className="h-8 w-16"/>
                                    <Skeleton className="h-8 w-16"/>
                                    <Skeleton className="h-8 w-16"/>
                                </div>
                            </Card>
                        ))
                    ) : (
                        objets.map((objet) => (
                            <Card key={objet.id} className="rounded-lg shadow hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">{objet.nom}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col items-center">
                                        {objet.image && objet.image.trim() !== "" ? (
                                            <Image
                                                src={`${objet.image}`}
                                                alt={`image of ${objet.nom}`}
                                                width={180}
                                                height={180}
                                                className="rounded-md object-cover mb-3 border"
                                            />
                                        ) : (
                                            <div
                                                className="w-[180px] h-[180px] flex items-center justify-center bg-gray-200 rounded-md mb-3 border text-gray-400 text-5xl">
                                                <span role="img" aria-label="placeholder">📦</span>
                                            </div>
                                        )}
                                        <p className="mb-4 text-gray-600 text-sm text-center">
                                            {objet.description.length > 50
                                                ? objet.description.substring(0, 50) + "..."
                                                : objet.description}
                                        </p>
                                        <div className="flex gap-2 justify-center">
                                            <Button size="sm"
                                                    onClick={() => redirect(Routes.troc.objet.toString(String(objet.id)))}>
                                                Voir
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => redirect(Routes.troc.objet.modify.toString(String(objet.id)))}
                                            >
                                                Modifier
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={async () => {
                                                    await deleteObjet(objet.id)
                                                    await fetchAll()
                                                }}
                                            >
                                                Supprimer
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                    {!loading && objets.length === 0 && (
                        <div className="text-center text-gray-400 italic col-span-full">
                            Aucun objet pour le moment.
                        </div>
                    )}
                </div>
            </div>

            {/* Demandes de troc */}
            <div className="flex-1 bg-white rounded-xl shadow-md p-6 space-y-6">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">Demandes de troc</h2>
                    <Button onClick={() => redirect(Routes.troc.create.toString())} className="font-medium">
                        Créer une demande
                    </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {loading && (
                        Array.from({length: 3}).map((_, idx) => (
                            <Card key={idx} className="rounded-lg shadow p-4 space-y-4">
                                <Skeleton className="h-6 w-2/3 mx-auto"/>
                                <Skeleton className="h-4 w-3/4 mx-auto"/>
                                <Skeleton className="h-8 w-full"/>
                            </Card>
                        ))
                    )}
                    {(!loading && (demandes.length === 0 || demandesList.length === 0)) ? (
                        <div className="text-center text-gray-400 italic col-span-full">
                            Aucune demande pour le moment.
                        </div>
                    ): demandesList }
                </div>
            </div>
        </div>
    )
}
