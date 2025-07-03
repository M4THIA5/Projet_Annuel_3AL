import React, { useEffect, useState } from "react"
import { Post } from "#/types/post"
import { getPostsByNeighborhoodId } from "#/lib/api_requests/post"
import { Card, CardContent } from "#/components/ui/card"
import { Button } from "#/components/ui/button"
import Lightbox from "react-image-lightbox"
import "react-image-lightbox/style.css"

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
                setPosts(postData)
            } catch (error) {
                console.error("Erreur lors du chargement des posts", error)
            } finally {
                setLoading(false)
            }
        }

        fetchNeighborhood()
    }, [neighborhoodId])


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
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">
                                {post.user.firstName} {post.user.lastName} ·{" "}
                                {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "short",
                                })}
                            </div>
                            <Button variant="outline" size="sm">
                                {post.type}
                            </Button>
                        </div>

                        <div
                            className="mt-2"
                            dangerouslySetInnerHTML={{ __html: post.content }}
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
                            <span>👀 Voir</span>
                            <Button size="sm">Participer</Button>
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
