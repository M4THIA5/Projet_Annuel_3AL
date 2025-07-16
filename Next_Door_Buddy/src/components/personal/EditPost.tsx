'use client'

import { useState, useEffect } from "react"
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
import { Post } from "#/types/post"
import { Label } from "#/components/ui/label"
import { updatePost } from "#/lib/api_requests/post"

interface EditPostDialogProps {
    post: Post
    onUpdate: () => void
}

export default function EditPostDialog({ post, onUpdate }: EditPostDialogProps) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<string>(post.content)
    const [images, setImages] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const [existingImages, setExistingImages] = useState<string[]>(post.images || [])
    const [type, setType] = useState<string>(post.type)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (images.length === 0) {
            setImagePreviews([])
            return
        }
        const objectUrls = images.map(file => URL.createObjectURL(file))
        setImagePreviews(objectUrls)
        return () => {
            objectUrls.forEach(url => URL.revokeObjectURL(url))
        }
    }, [images])

    const removeImage = (url: string) => {
        setExistingImages(existingImages.filter(img => img !== url))
    }

    const removeNewImage = (url: string) => {
        setImages(images.filter((_, i) => imagePreviews[i] !== url))
        setImagePreviews(imagePreviews.filter(preview => preview !== url))
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            await updatePost({
                postId: post._id,
                userId: post.userId,
                neighborhoodId: post.neighborhoodId,
                content: value,
                type,
                images,
                keptImages: existingImages,
            })
            toast.success("✅ Post mis à jour avec succès.")
            onUpdate()
            setOpen(false)
            setImages([])
            setImagePreviews([])
        } catch (error) {
            toast.error("❌ Échec de la mise à jour du post.")
            console.error("Erreur lors de la mise à jour du post :", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="text-xs px-2 py-1">Éditer</Button>
            </DialogTrigger>

            <DialogContent
                style={{
                    width: '600px',
                    maxWidth: '700px',
                    height: '500px',
                    maxHeight: '500px',
                    overflow: 'auto', // ajoute un scroll si le contenu dépasse
                }}
            >
                <DialogHeader>
                    <DialogTitle>Modifier le post</DialogTitle>
                </DialogHeader>

                <TooltipProvider>
                    <form className="flex flex-col w-full h-full" onSubmit={e => e.preventDefault()}>
                        {/* Éditeur */}
                        <div className="w-full h-full rounded-md border border-input">
                            <MinimalTiptapEditor
                                value={value}
                                onChange={setValue}
                                className="w-full h-full"
                                editorContentClassName="p-4 max-h-[30vh] max-w-[35vw] overflow-y-auto"
                                output="html"
                                editable
                                editorClassName="focus:outline-none"
                            />
                        </div>

                        {/* Images existantes */}
                        {existingImages.length > 0 && (
                            <>
                                <Label className="mt-4 mb-2 font-semibold text-gray-700">Images existantes</Label>
                                <div className="flex flex-wrap gap-3">
                                    {existingImages.map((url, index) => (
                                        <div
                                            key={index}
                                            className="relative w-24 h-24 border rounded overflow-hidden shadow-sm"
                                        >
                                            <img
                                                src={url}
                                                alt={`image-${index}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(url)}
                                                className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center shadow-md"
                                                title="Supprimer l'image"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Nouvelles images sélectionnées */}
                        {imagePreviews.length > 0 && (
                            <>
                                <Label className="mt-4 mb-2 font-semibold text-gray-700">Nouvelles images sélectionnées</Label>
                                <div className="flex flex-wrap gap-3">
                                    {imagePreviews.map((preview, index) => (
                                        <div
                                            key={index}
                                            className="relative w-24 h-24 border rounded overflow-hidden shadow-sm"
                                        >
                                            <img
                                                src={preview}
                                                alt={`new-image-${index}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(preview)}
                                                className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center shadow-md"
                                                title="Supprimer l'image"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Input pour ajouter nouvelles images */}
                        <Label className="text-sm text-gray-700 mb-1 mt-6">
                            Ajouter des images (optionnel)
                        </Label>
                        <Input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => {
                                if (!e.target.files) return
                                setImages(prev => [...prev, ...Array.from(e.target.files)])
                            }}
                            className="mb-4"
                        />

                        <div className="flex justify-end mt-auto">
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="px-4 py-2"
                            >
                                {isLoading ? "Enregistrement..." : "Enregistrer"}
                            </Button>
                        </div>
                    </form>
                </TooltipProvider>
            </DialogContent>
        </Dialog>
    )
}
