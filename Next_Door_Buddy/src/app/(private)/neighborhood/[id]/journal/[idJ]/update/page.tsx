"use client"

import React, { useEffect, useState, use } from "react"
import { getJournalPageById, updateJournal } from "#/lib/api_requests/jounal"
import { SimpleEditor } from "#/components/tiptap-templates/simple/simple-editor"
import { Button } from "#/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

type Props = { params: Promise<{ idJ: string }> }

export default function UpdateJournal({ params }: Props) {
    const resolvedParams = use(params)
    const idJ = resolvedParams.idJ

    const router = useRouter()

    const [types, setTypes] = useState("")
    const [editorContent, setEditorContent] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getJournalPageById(idJ)
                console.log(res)
                setTypes(Array.isArray(res.types) ? res.types.join(", ") : res.types || "")
                setEditorContent(res.content || "")
            } catch (error) {
                console.error("Erreur lors du chargement du journal :", error)
                toast.error("Impossible de charger le journal.")
            }
        }
        fetchData()
    }, [idJ])

    const handleCallback = (childData: string) => {
        setEditorContent(childData)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            await updateJournal(idJ, {
                types: types
                    .split(",")
                    .map((t) => t.trim())
                    .filter((t) => t.length > 0),
                content: editorContent,
            })
            toast.success("Le journal a été mis à jour avec succès !")
            router.back()
        } catch (error) {
            console.error("Erreur lors de la mise à jour du journal :", error)
            toast.error("Une erreur est survenue lors de la mise à jour du journal.")
        }
    }

    return (
        // Ne pas fixer min-h-screen avec flex-col centré, pour permettre le scroll naturel
        <div className="bg-gray-50 px-4 py-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md space-y-6">
                {/* Bouton Retour */}
                <div className="flex justify-start mb-4">
                    <Button variant="outline" onClick={() => router.back()}>
                        Retour
                    </Button>
                </div>

                <h1 className="text-3xl font-bold text-center text-gray-800">Modifier le Journal</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="types" className="block text-sm font-medium text-gray-700">
                            Type (séparés par des virgules)
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
                        <label className="block text-sm font-medium text-gray-700">Contenu</label>
                        <div className="border border-gray-300 rounded-md p-4 min-h-[300px] max-h-[70vh] overflow-auto">
                            <SimpleEditor initialContent={editorContent} parentCallback={handleCallback} />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button type="submit">Mettre à jour</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
