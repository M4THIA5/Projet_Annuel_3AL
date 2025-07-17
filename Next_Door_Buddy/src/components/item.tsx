"use client"

import React, { useEffect, useState } from "react"
import { UserProfile } from "#/types/user"
import { getProfile } from "#/lib/api_requests/user"
import { acceptRequest } from "#/lib/api_requests/services"
import { Button } from "#/components/ui/button"

interface Props {
    service: {
        id?: number
        title: string
        description: string
        askerId: number
    }
    onAccept?: (id: number) => void
}

export default function Item({ service, onAccept }: Props) {
    const [profile, setProfile] = useState<UserProfile | undefined>(undefined)
    const [loading, setLoading] = useState(false)

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
        if (!service.id) return
        setLoading(true)
        try {
            await acceptRequest(String(service.id))
            if (onAccept) onAccept(service.id)
        } catch (error) {
            console.error("Erreur lors de l'activation du service", error)
        } finally {
            setLoading(false)
        }
    }

    const isOwner = String(service.askerId) === String(profile?.id)

    return (
        <li className="border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow bg-white">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h2>
            <p className="text-gray-700 mb-4">
                {service.description.length > 80
                    ? service.description.substring(0, 80) + "…"
                    : service.description}
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
                        {loading ? "Chargement…" : "Activer"}
                    </Button>
                )}
            </div>
        </li>
    )
}
