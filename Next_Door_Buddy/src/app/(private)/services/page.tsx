"use client"

import React, { useEffect, useState } from "react"
import { getAvailableServices } from "#/lib/api_requests/services"
import ItemServices from "#/components/itemServices"
import { Button } from "#/components/ui/button"
import Link from "next/link"
import { getProfile } from "#/lib/api_requests/user"
import { UserProfile } from "#/types/user"
import {Service} from "#/types/service"

export default function ServicesPageClient() {
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<UserProfile | null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const [serviceList, user] = await Promise.all([
                    getAvailableServices(),
                    getProfile()
                ])
                setServices(serviceList)
                setProfile(user)
            } catch (error) {
                console.error("Erreur lors du chargement", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    function handleAccept(id: number) {
        setServices((prev) => prev.filter((service) => service.id !== id))
    }

    const demandesEnCours = services.filter(
        (service) => profile && String(service.askerId) === String(profile.id)
    )
    const servicesDisponibles = services.filter(
        (service) => profile && String(service.askerId) !== String(profile.id)
    )

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                    Services disponibles
                </h1>
                <Link href="/services/create" passHref>
                    <Button variant="default" className="px-6 py-2 text-base font-semibold">
                        Créer un service
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
            ) : servicesDisponibles.length > 0 ? (
                <ul className="space-y-6">
                    {servicesDisponibles.map((service) => (
                        <ItemServices
                            key={service.id}
                            service={service}
                            onAccept={handleAccept}
                        />
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 mt-12 text-lg italic">
                    Aucun service disponible pour le moment.
                </p>
            )}

            <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">
                Demande en cours
            </h2>

            {loading ? (
                <div className="space-y-6">
                    {[...Array(2)].map((_, i) => (
                        <div
                            key={i}
                            className="h-20 rounded-lg bg-gray-100 animate-pulse shadow-sm"
                        />
                    ))}
                </div>
            ) : demandesEnCours.length > 0 ? (
                <ul className="space-y-6">
                    {demandesEnCours.map((service) => (
                        <ItemServices key={service.id} service={service} />
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 text-lg italic">
                    Aucune demande en cours.
                </p>
            )}
        </div>
    )
}
