"use client"

import React, { useEffect, useState } from "react"
import { getAvailableServices } from "#/lib/api_requests/services"
import Item from "#/components/item"
import { Button } from "#/components/ui/button"
import Link from "next/link"

export default function ServicesPageClient() {
    const [services, setServices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchServices() {
            setLoading(true)
            try {
                const data = await getAvailableServices()
                setServices(data)
            } catch (error) {
                console.error("Erreur lors du chargement des services", error)
            } finally {
                setLoading(false)
            }
        }
        fetchServices()
    }, [])

    function handleAccept(id: number) {
        setServices((prev) => prev.filter((service) => service.id !== id))
    }

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
            ) : services.length > 0 ? (
                <ul className="space-y-6">
                    {services.map((service) => (
                        <Item
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
        </div>
    )
}
