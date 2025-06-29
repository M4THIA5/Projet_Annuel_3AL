"use client"
import {useState} from "react"

import {Input} from "#/components/ui/input"
import {Button} from "#/components/ui/button"
import {Label} from "#/components/ui/label"
import Image from "next/image"
import logo from "@/logo.png"
import {createObjet} from "#/lib/api_requests/troc";

export default function Create() {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]

            const reader = new FileReader()
            reader.onload = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    async function handleSubmit(event: { preventDefault: () => void }) {
        event.preventDefault()
        const formData = new FormData()
        formData.append("nom", name)
        if (description) {

            formData.append("description", description)
        }
        if (imagePreview) {
            formData.append("image", imagePreview)
        }
        await createObjet(formData).then(() => {
            window.location.href = "/troc"
        })

    }

    return (
        <div className={`h-screen flex flex-col items-center justify-center`}>
            <form className={"w-full max-w-md p-6 bg-white rounded-lg shadow-md space-y-4"} method={"POST"}
                  encType={"multipart/form-data"} onSubmit={handleSubmit}>

                <h1>Create an Object</h1>
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
                <Label htmlFor="image"> Image</Label>

                <Image
                    src={imagePreview || logo}
                    alt="Aperçu"
                    width={300}
                    height={200}
                    className={`w-[300px] h-[200px] object-cover rounded-lg border mx-auto`}
                />

                <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className={"border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"}
                />
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

