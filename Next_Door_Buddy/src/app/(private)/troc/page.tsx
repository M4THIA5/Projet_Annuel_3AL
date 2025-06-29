"use client"
// import TrocDashboard from "./trocDashboard"
import React, {useEffect, useState} from "react"
import {DemandeTroc, Objet} from "#/types/troc"
import {redirect} from "next/navigation"
import {deleteObjet, getObjets, getDemandesTroc, createDemandeTroc} from "#/lib/api_requests/troc"
import { Button } from "#/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "#/components/ui/card"
import Image from "next/image"
import { Routes } from "#/Routes"

export default function TrocPage() {

    const [objets, setObjets] = useState<Objet[]>([])
    const [demandes, setDemandes] = useState<DemandeTroc[]>([])

    useEffect(() => {
        async function fetchAll() {
            const [objetsData, demandesData] = await Promise.all([
                getObjets(),
                getDemandesTroc()
            ])
            setObjets(objetsData || [])
            setDemandes(demandesData || [])
        }

        fetchAll()
    }, [])

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
                {objets.map((objet) => (
                <Card key={objet.id} className="rounded-lg shadow hover:shadow-lg transition-shadow">
                    <CardHeader>
                    <CardTitle className="text-lg font-semibold">{objet.nom}</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <div className="flex flex-col items-center">
                        {objet.image && objet.image.trim() !== "" ? (
                            <Image
                                src={`data:image/jpeg;base64,${objet.image}`}
                                alt={`image of ${objet.nom}`}
                                width={180}
                                height={180}
                                className="rounded-md object-cover mb-3 border"
                            />
                        ) : (
                            <div className="w-[180px] h-[180px] flex items-center justify-center bg-gray-200 rounded-md mb-3 border text-gray-400 text-5xl">
                                <span role="img" aria-label="placeholder">📦</span>
                            </div>
                        )}
                        <p className="mb-4 text-gray-600 text-sm text-center">
                            {objet.description.length > 50
                                ? objet.description.substring(0, 50) + "..."
                                : objet.description}
                        </p>
                        <div className="flex gap-2 justify-center">
                            <Button size="sm" onClick={() => redirect(Routes.troc.objet.create.toString())}>
                                Voir
                            </Button>
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => () => redirect(Routes.troc.objet.create.toString())}
                            >
                                Modifier
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteObjet(objet.id)}
                            >
                                Supprimer
                            </Button>
                        </div>
                    </div>
                    </CardContent>
                </Card>
                ))}
                {objets.length === 0 && (
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
                <Button onClick={() => {}} className="font-medium">
                    Créer une demande
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {demandes.map((demande) => (
                <Card key={demande.id} className="rounded-lg shadow hover:shadow-lg transition-shadow">
                    <CardHeader>
                    <CardTitle className="text-lg font-semibold">{demande.asker}</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <div className="flex flex-col items-center">
                        <p className="mb-4 text-gray-600 text-sm text-center">
                        Souhaite troquer depuis le{" "}
                        <strong>{new Date(demande.createdAt).toLocaleDateString()}</strong>
                        </p>
                        <Button
                        size="sm"
                        onClick={() => {}}
                        className="w-full"
                        >
                        Accepter le troc
                        </Button>
                    </div>
                    </CardContent>
                </Card>
                ))}
                {demandes.length === 0 && (
                <div className="text-center text-gray-400 italic col-span-full">
                    Aucune demande pour le moment.
                </div>
                )}
            </div>
            </div>
        </div>
    )
}
