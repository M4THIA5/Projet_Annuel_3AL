"use client"

import React, { useEffect, useState } from "react"
import { getNextSorties } from "#/lib/api_requests/sorties"
import ItemSorties from "#/components/itemSorties"
import { Button } from "#/components/ui/button"
import Link from "next/link"
import {Sortie} from "#/types/sortie"

export default function SortiesPageClient() {
    const [sorties, setSorties] = useState<Sortie[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchSorties() {
            setLoading(true)
            try {
                const data = await getNextSorties()
                setSorties(data)
            } catch (error) {
                console.error("Erreur lors du chargement des sorties", error)
            } finally {
                setLoading(false)
            }
        }
        fetchSorties()
    }, [])

    function handleAccept(id: number) {
        setSorties((prev) => prev.filter((service) => service.id !== id))
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                    Sorties prochaines
                </h1>
                <Link href="/sorties/create" passHref>
                    <Button variant="default" className="px-6 py-2 text-base font-semibold">
                        Créer une sortie
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="h-24 rounded-lg bg-gray-200 animate-pulse shadow-sm"
                        />
                    ))}
                </div>
            ) : sorties.length > 0 ? (
                <ul className="space-y-6">
                    {sorties.map((sortie) => (
                        <ItemSorties
                            key={sortie.id}
                            sortie={sortie}
                            onAccept={handleAccept}
                        />
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 mt-12 text-lg italic">
                    Aucune sortie disponible prochainement.
                </p>
            )}
        </div>
    )
}
