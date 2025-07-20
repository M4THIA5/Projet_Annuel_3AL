'use client'

import React, {useState, useRef, ChangeEvent} from "react"
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
import {createPost} from "#/lib/api_requests/post"
import {Skeleton} from "#/components/ui/skeleton"
import {Avatar, AvatarImage, AvatarFallback} from "#/components/ui/avatar"
import {mdiHandshake, mdiSwapHorizontal, mdiCompass, mdiPlusBox} from "@mdi/js"
import Icon from "@mdi/react"
import {UserNeighborhood} from "#/types/user"
import {useRouter} from "next/navigation"
import {Content} from "@tiptap/react"

interface PostDialogProps {
    profileId: string
    neighborhoodId: string
    profile: UserNeighborhood
    loadPostsAction: () => Promise<void>
}

export default function AddPost({profileId, neighborhoodId, profile,loadPostsAction}: PostDialogProps) {
    const [value, setValue] = useState<Content>("")
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})
    const [images, setImages] = useState<File[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const dialogRef = useRef<HTMLButtonElement | null>(null)
    const router = useRouter()

    const getInitials = (value: string | undefined) =>
        value ? value.split(" ").map(word => word[0]?.toUpperCase()).join("").slice(0, 2) : ""

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        if (files.length > 4) {
            setFormErrors((prev) => ({
                ...prev,
                image: "Vous pouvez sélectionner jusqu'à 4 fichiers maximum.",
            }))
            setImages([])
            return
        }

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

        setFormErrors((prev) => ({...prev, image: ""}))  // Corrigé: "image" et non "images"
        setImages(validImages)
    }


    const handleSubmitPost = async () => {
        setIsLoading(true)
        try {
            if (typeof value === "string" && value.trim() !== "") {

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
                await loadPostsAction()
                dialogRef.current?.click() // Ferme le Dialog
            }
        } catch (error) {
            toast.error("❌ Impossible de publier le post. Veuillez réessayer.")
            console.error('Erreur lors de la création du post:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog>
            <div className="flex flex-col items-center gap-4 bg-gray-100 rounded-xl px-4 py-3 mb-6 shadow-sm">
                <div className="flex w-full items-center">
                    <Avatar className="mr-2">
                        <AvatarImage src={profile?.user.image?.toString()} alt={profile?.user.firstName}/>
                        <AvatarFallback>{getInitials(profile?.user.firstName)}</AvatarFallback>
                    </Avatar>

                    <DialogTrigger asChild>
                        <button
                            ref={dialogRef}
                            className="flex-1 w-full h-full rounded-full bg-white px-4 py-2 cursor-pointer hover:bg-gray-100 transition"
                        >
                            <span className="text-gray-400">Qu&apos;aimeriez-vous partager ?</span>
                        </button>
                    </DialogTrigger>
                </div>

                <div className="flex justify-around text-sm text-black space-x-4 select-none w-full">
                    <div className="flex justify-center gap-1 cursor-pointer hover:text-gray-400" onClick={() => router.push('/services')}>
                        <Icon path={mdiHandshake} size={0.9} className="mr-2"/>
                        <span>Proposer un service</span>
                    </div>
                    <div className="border-l h-5 border-gray-400"/>
                    <div className="flex justify-center gap-1 cursor-pointer hover:text-gray-400" onClick={() => router.push('/troc')}>
                        <Icon path={mdiSwapHorizontal} size={0.9} className="mr-2"/>
                        <span>Échanger</span>
                    </div>
                    <div className="border-l h-5 border-gray-400"/>
                    <div className="flex justify-center gap-1 cursor-pointer hover:text-gray-400" onClick={() => router.push('/sorties')}>
                        <Icon path={mdiCompass} size={0.9} className="mr-2"/>
                        <span>Proposer une excursion</span>
                    </div>
                    <div className="border-l h-5 border-gray-400"/>
                    <DialogTrigger asChild>
                        <div className="flex justify-center gap-1 cursor-pointer hover:text-gray-400 font-semibold">
                            <Icon path={mdiPlusBox} size={0.9} className="mr-2"/>
                            <span>Publier</span>
                        </div>
                    </DialogTrigger>
                </div>
            </div>

            <DialogContent className="p-6"
                           style={{width: '600px', maxWidth: '700px', height: '500px', maxHeight: '500px'}}>
                <DialogHeader>
                    <DialogTitle>Ajouter un post</DialogTitle>
                </DialogHeader>

                <TooltipProvider>
                    <form className="flex flex-col w-full h-full" onSubmit={(e) => e.preventDefault()}>
                        {isLoading ? (
                            <div className="w-full h-full rounded-md border border-input">
                                <Skeleton className="w-full h-[35vh] rounded-md" />
                            </div>
                        ) : (
                            <div className="w-full h-full rounded-md border border-input">
                                <MinimalTiptapEditor
                                    value={value}
                                    onChange={setValue}
                                    className="w-full h-full"
                                    editorContentClassName="p-4 max-h-[30vh] max-w-[35vw] overflow-y-auto"
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
