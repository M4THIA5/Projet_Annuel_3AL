"use client"
import {useEffect, useState} from "react"

import {Input} from "#/components/ui/input"
import {Button} from "#/components/ui/button"
import {Label} from "#/components/ui/label"
import {createDemandeTroc, getMyItems} from "#/lib/api_requests/troc"
import MultiSelect from "#/components/ui/MultiSelect"
import {Objet} from "#/types/troc"


export default function Create() {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")


    async function handleSubmit(event: { preventDefault: () => void }) {
        event.preventDefault()
        const formData = new FormData()
        formData.append("nom", name)
        if (description) {
            formData.append("description", description)
        }
        formData.append("items", JSON.stringify(items))
        await createDemandeTroc(formData).then(() => {
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

    const filteredObjets = objets.filter((obj) =>obj.TrocId === null )
    console.log(objets, filteredObjets)
    const options = filteredObjets.map(item => ({label: item.nom, value: String(item.id)}))

    return (
        <div className={`h-screen flex flex-col items-center justify-center`}>
            <form className={"w-full max-w-md p-6 bg-white rounded-lg shadow-md space-y-4"} method={"POST"}
                  encType={"multipart/form-data"} onSubmit={handleSubmit}>

                <h1>Create a troc </h1>
                <Label htmlFor="name">Name</Label>

                <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={"border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"}
                />
                <Label htmlFor="description">Description</Label>

                <Input
                    id="description"
                    name="description"
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className={"border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"}
                />
                <div className="grid gap-3">
                    <MultiSelect
                        options={options}
                        selectedValues={items}
                        setSelectedValues={setItems}
                        placeholder="Select items..."
                        name="items"
                    />
                </div>
                <div className="flex justify-end gap-4 mt-4">
                    <Button type="button" variant="outline" onClick={() => window.location.href = '/troc'}>
                        Annuler
                    </Button>
                    <Button type="submit">Enregistrer</Button>
                </div>
            </form>
        </div>
    )
}

