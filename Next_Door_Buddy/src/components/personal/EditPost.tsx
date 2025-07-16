'use client'

import {useState} from "react"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "#/components/ui/dialog"
import {Button} from "#/components/ui/button"
import {Input} from "#/components/ui/input"
import {TooltipProvider} from "#/components/ui/tooltip"
import {MinimalTiptapEditor} from "#/components/minimal-tiptap"
import {toast} from "react-toastify"
import {updatePost} from "#/lib/api_requests/post"
import {Post} from "#/types/post"
import {Label} from "#/components/ui/label"

interface EditPostDialogProps {
    post: Post
    onUpdate: () => void
}

export default function EditPostDialog({post, onUpdate}: EditPostDialogProps) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<string>(post.content)
    const [images, setImages] = useState<File[]>([])
    const [type, setType] = useState<string>(post.type)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            await updatePost({
                postId: post._id,
                userId: post.user._id,
                neighborhoodId: post.neighborhoodId,
                content: value,
                type,
                images
            })
            toast.success("✅ Post mis à jour avec succès.")
            onUpdate()
            setOpen(false) // Fermeture du dialogue ici
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

            <DialogContent className="p-6" style={{width: '600px', maxWidth: '700px', height: '500px', maxHeight: '500px'}}>
                <DialogHeader>
                    <DialogTitle>Modifier le post</DialogTitle>
                </DialogHeader>

                <TooltipProvider>
                    <form className="flex flex-col w-full h-full" onSubmit={(e) => e.preventDefault()}>
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

                        <Label className="text-sm text-gray-700 mb-1 mt-4">Images (optionnel)</Label>
                        <Input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => {
                                if (!e.target.files) return
                                setImages(Array.from(e.target.files))
                            }}
                        />

                        <div className="flex justify-end mt-4">
                            <Button type="button" onClick={handleSubmit} disabled={isLoading}>
                                {isLoading ? "Enregistrement..." : "Enregistrer"}
                            </Button>
                        </div>
                    </form>
                </TooltipProvider>
            </DialogContent>
        </Dialog>
    )
}
