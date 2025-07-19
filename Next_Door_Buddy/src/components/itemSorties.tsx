"use client"

import React, { useEffect, useState } from "react"
import { UserProfile } from "#/types/user"
import { getProfile } from "#/lib/api_requests/user"
import { acceptRequest } from "#/lib/api_requests/sorties"
import { Button } from "#/components/ui/button"
import {toast} from "react-toastify"
import {useRouter} from "next/navigation"
import {Sortie} from "#/types/sortie"

interface Props {
    sortie: Sortie
    onAccept?: (id: number) => void
}

function formatDateFr(isoDate: string) {
    const date = new Date(isoDate)
    return `${date.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    })} à ${date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    })}`
}

export default function ItemSorties({ sortie, onAccept }: Props) {
    const [profile, setProfile] = useState<UserProfile | undefined>(undefined)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [isAccepted, setIsAccepted] = useState(false)

    useEffect(() => {
        async function fetchProfile() {
            try {
                const data = await getProfile()
                setProfile(data)
                if (data.sorties?.some(s => s.id === sortie.id)) {
                    setIsAccepted(true)
                }
            } catch {
                // ignore or handle error
            }
        }
        fetchProfile()
    }, [])
    async function handleClickPlus(id:number|undefined){
        if (!id)return
        router.push("/sorties/"+id)
    }
    async function handleClick() {
        if (!sortie.id) return
        setLoading(true)
        try {
            await acceptRequest(String(sortie.id))
            if (onAccept) onAccept(sortie.id)
            toast.success(
                ({ closeToast }) => (
                    <div>
                        <p>✅ Vous avez bien été marqué comme participant à la sortie.</p>
                        <p>💬 Vous avez été intégré à un groupe de discussion.</p>
                        <Button
                            className="mt-2"
                            onClick={() => {
                                router.push(`/chat`)
                                closeToast?.()
                            }}
                        >
                            Aller au chat
                        </Button>
                    </div>
                ),
                {
                    autoClose: false, // Let user dismiss manually
                }
            )
        } catch (error) {
            console.error("Erreur lors de l'activation de la sortie", error)
        } finally {
            setLoading(false)
        }
    }

    const formattedDate = sortie.date ? formatDateFr(sortie.date) : null
    const isOwner = String(sortie.creatorId) === String(profile?.id)

    return (
        <li className="border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow bg-white">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{sortie.title}</h2>

            <p className="text-gray-700 mb-2">
                {sortie.description.length > 80
                    ? sortie.description.substring(0, 80) + "…"
                    : sortie.description}
            </p>

            {formattedDate && (
                <p className="text-sm text-gray-600 mb-1">
                    <strong>Date :</strong> {formattedDate}
                </p>
            )}

            {sortie.address && (
                <p className="text-sm text-gray-600 mb-1">
                    <strong>Adresse :</strong> {sortie.address}
                </p>
            )}

            {sortie.maxParticipants && (
                <p className="text-sm text-gray-600 mb-1">
                    <strong>Participants max :</strong> {sortie.maxParticipants}
                </p>
            )}
            {sortie.participants && (
                <p className="text-sm text-gray-600 mb-1">
                    <strong>Participants :</strong> {sortie.participants.length}
                </p>
            )}

            <div className="flex justify-end mt-3">
                {!isOwner && sortie.open && !sortie.ended && !isAccepted && (
                    <Button
                        onClick={handleClick}
                        disabled={loading}
                        variant="default"
                        size="sm"
                        className="flex items-center space-x-2"
                    >
                        {loading ? "Chargement…" : "Participer"}
                    </Button>
                )}
                &nbsp;
                <Button
                    onClick={()=> handleClickPlus(sortie.id)}
                    disabled={loading}
                    variant="default"
                    size="sm"
                    className="flex items-center space-x-2"
                >
                    {loading ? "Chargement…" : "Voir plus"}
                </Button>
            </div>
        </li>
    )
}
