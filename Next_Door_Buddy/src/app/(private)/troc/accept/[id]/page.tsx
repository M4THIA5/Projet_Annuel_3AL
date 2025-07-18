"use client"
import {useEffect, useState} from "react"

import {Button} from "#/components/ui/button"
import {cancelTroc, getMyItems, issetTroc, proposeTroc} from "#/lib/api_requests/troc"
import MultiSelect from "#/components/ui/MultiSelect"
import {Objet} from "#/types/troc"
import {redirect, useParams} from "next/navigation"


export default function Accept() {

    const params = useParams()
    const id = params.id?.toString() || ""
    useEffect(() => {
        async function checkAccess() {
            if (!await issetTroc(id)) {
                redirect('/troc')
            }
        }
        checkAccess()
    }, [id])


    async function handleSubmit(event: { preventDefault: () => void }) {
        event.preventDefault()
        await proposeTroc(id,items).then((value) => {
            if (value) window.location.href = "/troc"
            else console.error("vffvf")
        })

    }

    async function handleCancel(event: { preventDefault: () => void }) {
        event.preventDefault()
        await cancelTroc(id).then(() => {
            window.location.href = "/troc"
        })

    }

    const [items, setItems] = useState<string[]>([])
    const [objets, setObjets] = useState<Objet[]>([])
    useEffect(() => {
        async function getItems() {
            const data = await getMyItems()
            setObjets(data)
        }

        getItems()
    }, [])

    const filteredObjets = objets.filter((obj) => obj.TrocId === null)
    console.log(objets, filteredObjets)
    const options = filteredObjets.map(item => ({label: item.nom, value: String(item.id)}))

    return (
        <div className={`h-screen flex flex-col items-center justify-center`}>
            <form className={"w-full max-w-md p-6 bg-white rounded-lg shadow-md space-y-4"} method={"POST"}
                  encType={"multipart/form-data"} onSubmit={handleSubmit}>

                <h1>Troquer mes objets</h1>
                <div className="grid gap-3">
                    <MultiSelect
                        options={options}
                        selectedValues={items}
                        setSelectedValues={setItems}
                        placeholder="Select items..."
                        name="items"
                    />
                </div>
                <div className="flex justify-between gap-4 mt-4">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                        Annuler
                    </Button>
                    <Button type="submit">Troquer</Button>
                </div>
            </form>
        </div>
    )
}

