import React, { useEffect, useState } from "react"
import { Post } from "#/types/post"
import { getPostsByNeighborhoodId, deletePost } from "#/lib/api_requests/post"
import { Card, CardContent } from "#/components/ui/card"
import { Badge } from "#/components/ui/badge"
import { Skeleton } from "../ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar"
import { Button } from "#/components/ui/button"
import Lightbox from "react-image-lightbox"
import "react-image-lightbox/style.css"
import EditPost from "#/components/personal/EditPost"
import { getProfile } from "#/lib/api_requests/user"
import { User, UserNeighborhood } from "#/types/user"
import { toast } from "react-toastify"
import { Search } from "lucide-react"
import { Input } from "#/components/ui/input"
import { Neighborhood } from "#/types/neighborghood"
import AddPost from "#/components/personal/AddPost"
import DOMPurify from "dompurify"
import SafeHtmlRenderer from "#/components/personal/SafeHtmlRenderer";


interface PostFieldDialogProps {
    neighborhoodId: string
    profile?: UserNeighborhood
    neighborhood: Neighborhood
}

export default function FiedGeneralNeighborhood({ neighborhoodId, profile, neighborhood }: PostFieldDialogProps) {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [photoIndex, setPhotoIndex] = useState(0)
    const [activeImages, setActiveImages] = useState<string[]>([])
    const [currentUser, setCurrentUser] = useState<string>("")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedType, setSelectedType] = useState<string | null>(null)

    const loadPosts = async () => {
        setLoading(true)
        try {
            const postData = await getPostsByNeighborhoodId(neighborhoodId)
            const sortedPosts = postData.toSorted((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            setPosts(sortedPosts)
        } catch (error) {
            console.error("Erreur lors du chargement des posts", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadPosts()
        const fetchCurrentUser = async () => {
            try {
                const user = await getProfile()
                setCurrentUser(user.id)
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur courant", error)
            }
        }
        fetchCurrentUser()
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
            case "service":
                return "bg-blue-100 text-blue-700 border-blue-200"
            case "annonce":
                return "bg-green-100 text-green-700 border-green-200"
            case "discussion":
                return "bg-yellow-100 text-yellow-700 border-yellow-200"
            default:
                return "bg-muted text-muted-foreground border"
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

    const handleTypeFilter = (type: string | null) => {
        setSelectedType(type)
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase())
    }

    const filteredPosts = posts.filter(post => {
        if (!post || !post.user) return false

        const matchType = selectedType
            ? post.type?.toLowerCase() === selectedType.toLowerCase()
            : true

        const contentMatch = post.content?.toLowerCase().includes(searchTerm)
        const firstNameMatch = post.user.firstName?.toLowerCase().includes(searchTerm)
        const lastNameMatch = post.user.lastName?.toLowerCase().includes(searchTerm)

        const matchSearch = contentMatch || firstNameMatch || lastNameMatch

        return matchType && matchSearch
    })

    if (loading) {
        return (
            <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                    <Card className="mb-6" key={i}>
                        <CardContent className="pr-4 pl-4 py-6 space-y-4">
                            <Skeleton className="h-4 w-[60%]" />
                            <Skeleton className="h-4 w-[80%]" />
                            <Skeleton className="h-64 w-full rounded-lg" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <>
            {profile && neighborhood && (
                <AddPost
                    profileId={profile.user.id.toString()}
                    neighborhoodId={neighborhoodId}
                    profile={profile}
                    neighborhood={neighborhood}
                    loadPosts={loadPosts}
                />
            )}

            {/* Barre de filtre */}
            <div className="flex items-center justify-between border-b pb-2 mb-4">
                <div className="flex gap-6 font-medium">
                    {["All", "Service", "Trocs", "Excursion"].map(type => (
                        <span
                            key={type}
                            onClick={() => handleTypeFilter(type === "All" ? null : type)}
                            className={`cursor-pointer pb-1 ${
                                selectedType === null && type === "All"
                                    ? "border-b-2 border-gray-500"
                                    : selectedType?.toLowerCase() === type.toLowerCase()
                                        ? "border-b-2 border-gray-500"
                                        : ""
                            }`}
                        >
                            {type}
                        </span>
                    ))}
                </div>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        className="pl-8"
                        placeholder="Rechercher"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            {/* Liste des posts filtrés */}
            <div className="max-h-[60vh] max-w-[55vw] overflow-y-auto pr-2 space-y-6">
                {filteredPosts.map((post) => (
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
                                        <span className="text-muted-foreground">{formatJoinedDuration(post.createdAt)}</span>
                                    </div>
                                </div>
                                <Badge
                                    variant="outline"
                                    className={`${getBadgeColor(post.type)} rounded-full px-3 py-0.5`}
                                >
                                    {capitalize(post.type)}
                                </Badge>
                            </div>
                            <SafeHtmlRenderer
                                html={post.content}
                                maxWidth="100%"
                                maxHeight="400px"
                            />


                            {post.images.length > 0 && (
                                <div className={`grid gap-2 mt-4 ${
                                    post.images.length === 1
                                        ? "grid-cols-1"
                                        : post.images.length === 2
                                            ? "grid-cols-2"
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

                            {post.type === "post" ? (
                                <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                                    <span>👍 Upvote</span>
                                    <span>💬 Commenter</span>
                                    <span>👀 Vu </span>
                                    {currentUser.toString() === post.userId.toString() && (
                                        <div className="flex gap-2">
                                            <EditPost post={post} onUpdate={loadPosts} />
                                            <Button
                                                variant="ghost"
                                                className="text-xs px-2 py-1"
                                                type="button"
                                                onClick={async () => {
                                                    try {
                                                        await deletePost(post._id)
                                                        toast.success("✅ Votre post a bien été supprimé.")
                                                        await loadPosts()
                                                    } catch (error) {
                                                        console.error("Erreur lors de la suppression du post :", error)
                                                        toast.error("❌ Une erreur est survenue lors de la suppression du post.")
                                                    }
                                                }}
                                            >
                                                Supprimer
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : post.type === "service" ? (
                                <div className="flex w-full justify-end mt-4">
                                    <Button
                                        variant="default"  // ou "primary" si tu as ce variant configuré dans ton thème
                                        onClick={() => (window.location.href = "/services")}
                                        className="px-4 py-2"
                                        type="button"
                                    >
                                        Voir les services
                                    </Button>
                                </div>
                            ) : null}

                        </CardContent>
                    </Card>
                ))}
            </div>

            {isOpen && (
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
