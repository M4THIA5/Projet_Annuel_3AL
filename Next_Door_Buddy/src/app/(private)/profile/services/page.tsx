"use client"
import React, {useEffect, useState} from 'react'
import {fetchUserServices} from "#/lib/api_requests/services"
import {Service} from '#/types/service'


const ListeServices: React.FC = () => {
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchUserServices().then(data => {
            setServices(data)
            setLoading(false)
        })
    }, [])

    if (loading) return <div>Chargement...</div>

    return (
        <div>
            <h2>Mes services initiés</h2>
            <ul>
                {services.map(service => (
                    <li key={service.id}>
                        <strong>{service.title}</strong> : {service.description}
                        {service.providerId ? service.provider && (
                            <span>
                                Accepté par {service.provider.firstName} {service.provider.lastName}
                            </span>
                        ) : ""}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ListeServices
