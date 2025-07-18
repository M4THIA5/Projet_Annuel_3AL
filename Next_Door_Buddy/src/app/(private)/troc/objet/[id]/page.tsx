'use client'

import React, { useEffect, useState } from 'react'
import { use } from 'react'
import { Button } from '#/components/ui/button'
import Image from 'next/image'
import { getObjet } from '#/lib/api_requests/troc'

type Objet = {
    id: number
    nom: string
    description: string
    image: string
}

type Props = {
    params: Promise<{
        id: string
    }>
}

export default function ObjetDetailPage({ params }: Props) {
    const { id } = use(params) // ✅ unwrap the params Promise

    const [objet, setObjet] = useState<Objet | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchObjet() {
            try {
                const res = await getObjet(id)
                setObjet(res)
            } catch (e) {
                alert('Erreur: ' + (e as Error).message)
            } finally {
                setLoading(false)
            }
        }
        fetchObjet()
    }, [id])

    function handleModifier() {
        window.location.href = `/objet/${id}/edit`
    }

    async function handleSupprimer() {
        if (!confirm('Voulez-vous vraiment supprimer cet objet ?')) return
        try {
            const res = await fetch(`/api/objets/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Erreur lors de la suppression')
            window.location.href = '/troc'
        } catch (e) {
            alert('Erreur: ' + (e as Error).message)
        }
    }

    if (loading) return <p>Chargement...</p>
    if (!objet) return <p>Objet non trouvé</p>

    return (
        <div>
            <h1>{objet.nom}</h1>
            <p>{objet.description}</p>
            <Image alt={`Image pour l'objet ${objet.nom}`} src={objet.image} width={200} height={200} />
            <Button variant="outline" onClick={handleModifier}>Modifier</Button>
            <Button variant="destructive" onClick={handleSupprimer}>Supprimer</Button>
        </div>
    )
}
