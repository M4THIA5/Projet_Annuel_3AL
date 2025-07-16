import React, { useEffect, useState } from "react"
import { Post } from "#/types/post"
import { getPostsByNeighborhoodId } from "#/lib/api_requests/post"
import { Card, CardContent } from "#/components/ui/card"
import { Badge } from "#/components/ui/badge"
import { Skeleton } from "../ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar"
import Lightbox from "react-image-lightbox"
import "react-image-lightbox/style.css"
import EditPost from "#/components/personal/EditPost";

interface PostFieldDialogProps {
    neighborhoodId: string
}

export default function AddPost({ neighborhoodId }: PostFieldDialogProps) {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [photoIndex, setPhotoIndex] = useState(0)
    const [activeImages, setActiveImages] = useState<string[]>([])

    useEffect(() => {
        const fetchNeighborhood = async () => {
            try {
                const postData = await getPostsByNeighborhoodId(neighborhoodId)
                const sortedPosts = postData.toSorted((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                setPosts(sortedPosts)
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
            case "post": return "bg-gray-100 text-gray-700 border-gray-200"
            case "événement": return "bg-blue-100 text-blue-700 border-blue-200"
            case "annonce": return "bg-green-100 text-green-700 border-green-200"
            case "discussion": return "bg-yellow-100 text-yellow-700 border-yellow-200"
            default: return "bg-muted text-muted-foreground border"
        }
    }

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()

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

    if (loading) {
        return (
            <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                    <Card className="mb-6" key={i}>
                        <CardContent className="pr-4 pl-4 py-6 space-y-4">
                            <div className="flex justify-between">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="flex flex-col space-y-1">
                                        <Skeleton className="h-4 w-40 rounded" />
                                        <Skeleton className="h-3 w-24 rounded" />
                                    </div>
                                </div>
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full rounded" />
                                <Skeleton className="h-4 w-3/4 rounded" />
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-4">
                                <Skeleton className="h-32 w-full rounded-lg" />
                                <Skeleton className="h-32 w-full rounded-lg" />
                            </div>
                            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-6" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <>
            <div className="max-h-[60vh] max-w-[55vw] overflow-y-auto pr-2 space-y-6">
                {posts.map((post) => (
                    <Card className="mb-6" key={post._id}>
                        <CardContent className="pr-4 pl-4">
                            <div className="flex justify-between">
                                <div className="flex items-center">
                                    <Avatar className="mr-2">
                                        <AvatarImage src={post.user.image?.toString()} alt={post.user.firstName} />
                                        <AvatarFallback>{getInitials(post?.user.firstName)}</AvatarFallback>
                                    </Avatar>
                                    <div className="text-sm font-medium">
                                        {post.user.firstName} {post.user.lastName} ·{" "}
                                        <span className="text-muted-foreground">
                      {formatJoinedDuration(post.createdAt)}
                    </span>
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
                                className="mt-2 wrap-normal large-text"
                                style={{
                                    whiteSpace: "normal",
                                    wordWrap: "break-word",
                                    overflowWrap: "break-word",
                                    wordBreak: "break-word"
                                }}
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            {post.images.length > 0 && (
                                <div className={`grid gap-2 mt-4 ${
                                    post.images.length === 1
                                        ? "grid-cols-1"
                                        : post.images.length === 2
                                            ? "grid-cols-2"
                                            : post.images.length === 3
                                                ? "grid-cols-2 grid-rows-2"
                                                : "grid-cols-2 grid-rows-2"
                                }`}>
                                    {post.images.slice(0, 4).map((img, idx) => {
                                        let className = "rounded-lg cursor-pointer object-cover w-full h-64"

                                        if (post.images.length === 3 && idx === 0) {
                                            className += " row-span-2 h-full"
                                        }

                                        return (
                                            <img
                                                key={idx}
                                                src={img}
                                                alt={`Image ${idx + 1}`}
                                                className={className}
                                                onClick={() => openLightbox(post.images, idx)}
                                            />
                                        )
                                    })}

                                    {post.images.length > 4 && (
                                        <div
                                            className="relative rounded-lg cursor-pointer bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl font-bold h-64"
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
                                <EditPost
                                    post={post}
                                    onUpdate={async () => {
                                        try {
                                            const updatedPosts = await getPostsByNeighborhoodId(neighborhoodId)
                                            const sorted = updatedPosts.toSorted((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                            setPosts(sorted)
                                        } catch (err) {
                                            console.error("Erreur lors de la mise à jour des posts après édition :", err)
                                        }
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {isOpen && activeImages.length > 0 && (
                <Lightbox
                    mainSrc={activeImages[photoIndex]}
                    nextSrc={activeImages[(photoIndex + 1) % activeImages.length]}
                    prevSrc={activeImages[(photoIndex + activeImages.length - 1) % activeImages.length]}
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
