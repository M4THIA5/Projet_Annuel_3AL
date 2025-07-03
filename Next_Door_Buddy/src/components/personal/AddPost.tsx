'use client'

import { useState, useRef } from "react"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "#/components/ui/dialog"
import { Button } from "#/components/ui/button"
import { Input } from "#/components/ui/input"
import { TooltipProvider } from "#/components/ui/tooltip"
import { MinimalTiptapEditor } from "#/components/minimal-tiptap"
import { toast } from "react-toastify"
import { createPost } from "#/lib/api_requests/post"
import { Skeleton } from "#/components/ui/skeleton"

interface PostDialogProps {
    profileId: string
    neighborhoodId: string
}

export default function AddPost({ profileId, neighborhoodId }: PostDialogProps) {
    const [value, setValue] = useState<string>("")
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})
    const [images, setImages] = useState<File[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const dialogRef = useRef<HTMLButtonElement | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const validImages: File[] = []
        const errors: string[] = []

        Array.from(files).forEach((file) => {
            if (!file.type.startsWith("image/")) {
                errors.push(`${file.name} n'est pas un fichier image.`)
            } else {
                validImages.push(file)
            }
        })

        if (errors.length > 0) {
            setFormErrors((prev) => ({
                ...prev,
                image: errors.join(" "),
            }))
            setImages([])
            return
        }

        setFormErrors((prev) => ({ ...prev, images: "" }))
        setImages(validImages)
    }

    const handleSubmitPost = async () => {
        setIsLoading(true)
        try {
            await createPost({
                userId: profileId,
                neighborhoodId,
                content: value,
                type: 'post',
                images: images,
            })
            toast.success("✅ Votre post a bien été ajouté au quartier.")
            setValue("")
            setImages([])
            dialogRef.current?.click() // Ferme le Dialog
        } catch (error) {
            toast.error("❌ Impossible de publier le post. Veuillez réessayer.")
            console.error('Erreur lors de la création du post:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    ref={dialogRef}
                    className="flex-1 w-full h-full rounded-full bg-white px-4 py-2 cursor-pointer hover:bg-gray-100 transition"
                >
                    <span className="text-gray-400">Qu&apos;aimeriez-vous partager ?</span>
                </button>
            </DialogTrigger>

            <DialogContent className="p-6"  style={{ width: '600px', maxWidth: '700px', height: '500px',maxHeight: '500px', }}>
                <DialogHeader>
                    <DialogTitle>Ajouter un post</DialogTitle>
                </DialogHeader>

                <TooltipProvider>
                    <form className="flex flex-col w-full  h-full" onSubmit={(e) => e.preventDefault()}>
                        {isLoading ? (
                            <Skeleton className="w-full h-full rounded-md" />
                        ) : (
                            <div className="flex-1 w-full h-full rounded border border-input">
                                <MinimalTiptapEditor
                                    value={value}
                                    onChange={setValue}
                                    className="w-full"
                                    editorContentClassName="p-5 max-h-[300px] max-w-[600px] overflow-y-auto"
                                    output="html"
                                    autofocus
                                    editable
                                    editorClassName="focus:outline-none"
                                />
                            </div>
                        )}
                        <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className={formErrors.image ? "border-red-500 mt-2 mb-2" : "mt-2 mb-2"}
                            disabled={isLoading}
                        />
                        {formErrors.image && (
                            <p className="text-red-500 text-sm">{formErrors.image}</p>
                        )}
                        <div className="flex justify-end">
                            <Button type="button" onClick={handleSubmitPost} disabled={isLoading}>
                                {isLoading ? "Publication..." : "Publier"}
                            </Button>
                        </div>
                    </form>
                </TooltipProvider>
            </DialogContent>
        </Dialog>
    )
}
