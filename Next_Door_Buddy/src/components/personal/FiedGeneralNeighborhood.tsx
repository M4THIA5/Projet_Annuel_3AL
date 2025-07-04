import React, {useEffect, useState} from "react"
import {Post} from "#/types/post"
import {getPostsByNeighborhoodId} from "#/lib/api_requests/post"
import {Card, CardContent} from "#/components/ui/card"
import {Button} from "#/components/ui/button"
import Lightbox from "react-image-lightbox"
import "react-image-lightbox/style.css"
import {Avatar, AvatarFallback, AvatarImage} from "#/components/ui/avatar"
import {Badge} from "#/components/ui/badge"

interface PostFieldDialogProps {
    neighborhoodId: string
}

export default function AddPost({neighborhoodId}: PostFieldDialogProps) {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)

    const [isOpen, setIsOpen] = useState(false)
    const [photoIndex, setPhotoIndex] = useState(0)
    const [activeImages, setActiveImages] = useState<string[]>([])

    useEffect(() => {
        const fetchNeighborhood = async () => {
            try {
                const postData = await getPostsByNeighborhoodId(neighborhoodId)
                setPosts(postData)
            } catch (error) {
                console.error("Erreur lors du chargement des posts", error)
            } finally {
                setLoading(false)
            }
        }

        fetchNeighborhood()
    }, [neighborhoodId])

    const getInitials = (value: string | undefined) =>
        value ? value.split(" ").map(word => word[0]?.toUpperCase()).join("").slice(0, 2) : ""

    const formatJoinedDuration = (joinedAt: string | number | Date) => {
        const joinedDate = new Date(joinedAt)
        const now = new Date()
        const diffMs = now.getTime() - joinedDate.getTime()
        const diffMinutes = Math.floor(diffMs / (1000 * 60))
        const diffHours = Math.floor(diffMinutes / 60)
        const diffDays = Math.floor(diffHours / 24)
        const diffMonths = Math.floor(diffDays / 30)
        const diffYears = Math.floor(diffDays / 365)

        if (diffYears >= 1) return `Il y a ${diffYears} an${diffYears > 1 ? "s" : ""}`
        if (diffMonths >= 1) return `Il y a ${diffMonths} mois`
        if (diffDays >= 1) return `Il y a ${diffDays} jour${diffDays > 1 ? "s" : ""}`
        if (diffHours >= 1) return `Il y a ${diffHours} heure${diffHours > 1 ? "s" : ""}`
        return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`
    }

    const getBadgeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case "post":
                return "bg-gray-100 text-gray-700 border-gray-200"
            case "événement":
                return "bg-blue-100 text-blue-700 border-blue-200"
            case "annonce":
                return "bg-green-100 text-green-700 border-green-200"
            case "discussion":
                return "bg-yellow-100 text-yellow-700 border-yellow-200"
            default:
                return "bg-muted text-muted-foreground border"
        }
    }

    const capitalize = (s: string) =>
        s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()


    const openLightbox = (images: string[], index: number) => {
        if (isOpen) return

        setActiveImages(images)
        setPhotoIndex(index)
        setIsOpen(true)
    }

    const onCloseRequest = () => {
        setIsOpen(false)
        setActiveImages([])
        setPhotoIndex(0)
    }


    if (loading) return <p>Chargement des posts...</p>

    return (
        <>
            {posts.map((post) => (
                <Card className="mb-6" key={post._id}>
                    <CardContent className="pr-4 pl-4">
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <Avatar className="mr-2">
                                    <AvatarImage src={post.user.image?.toString()} alt={post.user.firstName}/>
                                    <AvatarFallback>{getInitials(post?.user.firstName)}</AvatarFallback>
                                </Avatar>
                                <div className="text-sm font-medium">
                                    {post.user.firstName} {post.user.lastName} · <span
                                    className="text-muted-foreground">{formatJoinedDuration(post.createdAt)}</span>

                                </div>
                            </div>
                            <Badge
                                variant="outline"
                                className={`${getBadgeColor(post.type)} rounded-full px-3 py-0.5`}
                            >
                                {capitalize(post.type)}
                            </Badge>
                        </div>


                        <div
                            className="mt-2"
                            dangerouslySetInnerHTML={{__html: post.content}}
                        />

                        {post.images.length > 0 && (
                            <div className={`grid gap-2 mt-4 ${
                                post.images.length === 1 ? 'grid-cols-1' :
                                    post.images.length === 2 ? 'grid-cols-2' :
                                        'grid-cols-2 grid-rows-2'
                            }`}>
                                {post.images.slice(0, 4).map((img, idx) => {
                                    // Si 3 images, on peut faire une mise en page spéciale
                                    if (post.images.length === 3) {
                                        if (idx === 0)
                                            return (
                                                <img
                                                    key={idx}
                                                    src={img}
                                                    alt={`Image ${idx + 1}`}
                                                    className="rounded-lg cursor-pointer row-span-2 object-cover w-full h-full"
                                                    onClick={() => openLightbox(post.images, idx)}
                                                />
                                            )
                                        else
                                            return (
                                                <img
                                                    key={idx}
                                                    src={img}
                                                    alt={`Image ${idx + 1}`}
                                                    className="rounded-lg cursor-pointer object-cover w-full h-full"
                                                    onClick={() => openLightbox(post.images, idx)}
                                                />
                                            )
                                    }

                                    return (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={`Image ${idx + 1}`}
                                            className="rounded-lg cursor-pointer object-cover w-full h-full"
                                            onClick={() => openLightbox(post.images, idx)}
                                        />
                                    )
                                })}

                                {post.images.length > 4 && (
                                    <div
                                        className="relative rounded-lg cursor-pointer bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl font-bold"
                                        onClick={() => openLightbox(post.images, 4)}
                                    >
                                        <img
                                            src={post.images[4]}
                                            alt="Plus d'images"
                                            className="rounded-lg object-cover w-full h-full opacity-50"
                                        />
                                        <span className="absolute">+{post.images.length - 4}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                            <span>👍 Upvote</span>
                            <span>💬 Commenter</span>
                            <span>👀 Vu</span>
                            <span></span> {/*Ne pas enlever*/}
                        </div>
                    </CardContent>
                </Card>
            ))}

            {isOpen && activeImages.length > 0 && (
                <Lightbox
                    mainSrc={activeImages[photoIndex]}
                    nextSrc={activeImages[(photoIndex + 1) % activeImages.length]}
                    prevSrc={
                        activeImages[(photoIndex + activeImages.length - 1) % activeImages.length]
                    }
                    onCloseRequest={onCloseRequest}
                    onMovePrevRequest={() =>
                        setPhotoIndex((photoIndex + activeImages.length - 1) % activeImages.length)
                    }
                    onMoveNextRequest={() =>
                        setPhotoIndex((photoIndex + 1) % activeImages.length)
                    }
                />
            )}
        </>
    )
}
