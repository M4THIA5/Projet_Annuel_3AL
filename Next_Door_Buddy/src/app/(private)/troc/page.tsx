"use client"
import TrocDashboard from "./trocDashboard"
import React, {useEffect, useState} from "react"
import {UserProfile} from "#/types/user"
import {getProfile} from "#/lib/api_requests/user"
import {DemandeTroc, Objet} from "#/types/troc"
import {useRouter} from "next/navigation"
import {deleteObjet, getObjets, getDemandesTroc, createDemandeTroc} from "#/lib/api_requests/troc"


function sleep(ms: number | undefined) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function getAllObjets() {
    await sleep(4000)
    return getObjets()
    return [
        {id: 1, nom: "Chaise", image: "", description: "Une chaise en bois"},
        {id: 2, nom: "Lampe", image: "", description: "Lampe de chevet blanche"}
    ]
}

async function getDemandes() {
    await sleep(4000)
    return getDemandesTroc()
    return [
        {id: 101,userId:2, asker: "Jean", createdAt: new Date()},
        {
            id: 102,
            userId: 1,
            asker: "Claire",
            createdAt: new Date(new Date().setHours(new Date().getHours() - 2))
        }
    ]
}

async function createTroc() {
    await createDemandeTroc()
}

export default function Base() {
    const [profile, setProfile] = useState<UserProfile | undefined>(undefined)
    const r = useRouter()

    useEffect(() => {
        async function fetchProfile() {
            const data = await getProfile()
            setProfile(data)
        }

        fetchProfile()
    }, [])

    const [objets, setObjets] = useState<Objet[] | undefined>(undefined)

    async function fetchObjets() {
        const data = await getAllObjets()
        setObjets(data)
    }

    useEffect(() => {
        fetchObjets()
    }, [])
    const [demandes, setDemandes] = useState<DemandeTroc[] | undefined>(undefined)

    useEffect(() => {
        async function fetchDemandes() {
            const data = await getDemandes()
            setDemandes(data)
        }

        fetchDemandes()
    }, [])

    if (!profile && !objets && !demandes) {
        return <div>Loading...</div>
    } else if (!objets && !demandes) {
        return (
            <>
                <div className="flex flex-row gap-6 p-4 justify-around">
                    <div className={"flex flex-col"}>

                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-start">
                                <h2 className="text-xl font-semibold">Mes objets</h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>Loading...</div>
                        </div>
                    </div>
                    <div className={"flex flex-col"}>

                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-start">
                                <h2 className="text-xl font-semibold">Demandes de troc</h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>Loading...</div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    function see(id: number) {
        r.push("/objet/" + id)
    }

    function modify(id: number) {
        r.push("/objet/" + id + "/modify")
    }

    function create() {
        r.push("/objet/create")
    }

    function delet(id: number) {
        deleteObjet(id.toString()).then(async () => {
            const data = await getAllObjets()
            setObjets(data)
            //TODO: show a toast notification ?
        })
    }

    return (
        <TrocDashboard
            objets={objets}
            demandes={demandes}
            onVoir={(id) => see(id)}
            onModifier={(id) => modify(id)}
            onSupprimer={(id) => delet(id)}
            onCreerObjet={create}
            onAccepterTroc={(id) => alert("Accepter troc de" + id)}
            onCreerTroc={createTroc}
        />)

}
