"use client"

import React, { useEffect, useState } from "react"
import { UserProfile } from "#/types/user"
import { getProfile } from "#/lib/api_requests/user"
import { acceptRequest } from "#/lib/api_requests/sorties"
import { Button } from "#/components/ui/button"
import {toast} from "react-toastify"
import {useRouter} from "next/navigation"

interface Props {
    sortie: {
        id?: number
        title: string
        description: string
        askerId: number
    }
    onAccept?: (id: number) => void
}

export default function ItemSorties({ sortie, onAccept }: Props) {
    const [profile, setProfile] = useState<UserProfile | undefined>(undefined)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        async function fetchProfile() {
            try {
                const data = await getProfile()
                setProfile(data)
            } catch {
                // ignore or handle error
            }
        }
        fetchProfile()
    }, [])

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
            );
        } catch (error) {
            console.error("Erreur lors de l'activation de la sortie", error)
        } finally {
            setLoading(false)
        }
    }

    const isOwner = String(sortie.askerId) === String(profile?.id)

    return (
        <li className="border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow bg-white">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{sortie.title}</h2>
            <p className="text-gray-700 mb-4">
                {sortie.description.length > 80
                    ? sortie.description.substring(0, 80) + "…"
                    : sortie.description}
            </p>

            <div className="flex justify-end">
                {!isOwner && (
                    <Button
                        onClick={handleClick}
                        disabled={loading}
                        variant="default"
                        size="sm"
                        className="flex items-center space-x-2"
                    >
                        {loading ? "Chargement…" : "Rejoindre la sortie"}
                    </Button>
                )}
            </div>
        </li>
    )
}
