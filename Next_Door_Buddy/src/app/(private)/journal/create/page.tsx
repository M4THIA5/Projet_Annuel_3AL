"use client"

import { SimpleEditor } from "#/components/tiptap-templates/simple/simple-editor"
import { createJournal } from "#/lib/api_requests/jounal"
import { Button } from "#/components/ui/button"
import { useState } from "react"

export default function Journal() {
    const [types, setTypes] = useState("")
    const [district, setDistrict] = useState("")
    const [editorContent, setEditorContent] = useState("")

    const handleCallback = (childData: string) => {
        setEditorContent(childData)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const response = await createJournal({
            types: [types],
            districtId: district,
            content: editorContent
        })
        if (response) {
            window.location.href = "/"
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-md space-y-6">
                <h1 className="text-3xl font-bold text-center text-gray-800">Créer un Journal</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="types" className="block text-sm font-medium text-gray-700">
                            Type
                        </label>
                        <input
                            id="types"
                            name="types"
                            value={types}
                            onChange={(e) => setTypes(e.target.value)}
                            placeholder="Ex: évènement, alerte..."
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                            Quartier
                        </label>
                        <input
                            id="district"
                            name="district"
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            placeholder="ID du quartier"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Contenu
                        </label>
                        <div className="border border-gray-300 rounded-md p-4">
                            <SimpleEditor parentCallback={handleCallback} />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button type="submit">
                            Publier
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
