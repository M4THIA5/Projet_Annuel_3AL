"use client"

import React, {useState, useEffect} from "react"
import {Card, CardContent} from "#/components/ui/card"
import {Button} from "#/components/ui/button"
import {Input} from "#/components/ui/input"
import {Avatar, AvatarFallback, AvatarImage} from "#/components/ui/avatar"
import {ScrollArea} from "#/components/ui/scroll-area"
import {Skeleton} from "#/components/ui/skeleton"
import { ToastContainer, toast } from "react-toastify"
import {
    mdiBookOpenPageVariant,
    mdiChatOutline,
    mdiMapMarker,
    mdiLogout,
    mdiCog,
    mdiHandshake,
    mdiCompass,
    mdiPlusBox,
    mdiSwapHorizontal
} from "@mdi/js"
import Icon from "@mdi/react"
import {useRouter} from "next/navigation"
import {Search} from "lucide-react"
import {getNeighborhood, getUsersOfNeighborhood} from "#/lib/api_requests/neighborhood"
import {Neighborhood} from "#/types/neighborghood"
import {getProfile} from "#/lib/api_requests/user"
import {UserNeighborhood} from "#/types/user"
import AddPost from "#/components/personal/AddPost";


const NeighborhoodCommunityPage = ({params}: { params: Promise<{ id: string }> }) => {
    const unwrappedParams = React.use(params)
    const NeighborhoodId = decodeURIComponent(unwrappedParams.id)
    const router = useRouter()
    const [profile, setProfile] = useState<UserNeighborhood | undefined>(undefined)
    const [neighborhood, setNeighborhood] = useState<Neighborhood | null>(null)
    const [userNeighborhoods, setUserNeighborhoods] = useState<UserNeighborhood[]>([])
    const [loadingMembers, setLoadingMembers] = useState<boolean>(true)
    const [loadingButtons, setLoadingButtons] = useState<boolean>(true)

    useEffect(() => {
        const fetchNeighborhood = async () => {
            try {
                const user = await getProfile()
                const neighborhoodData = await getNeighborhood(NeighborhoodId)
                setNeighborhood(neighborhoodData)

                const userNeighborhoodsData = await getUsersOfNeighborhood(NeighborhoodId)
                setUserNeighborhoods(userNeighborhoodsData)

                const found = userNeighborhoodsData.find(n => n.user.id === Number(user.id))
                if (found) setProfile({...found})

                setLoadingMembers(false)
                setLoadingButtons(false)
            } catch (error) {
                console.error("Erreur lors du chargement du quartier ou des utilisateurs :", error)
                setLoadingMembers(false)
                setLoadingButtons(false)
            }
        }

        fetchNeighborhood()
    }, [NeighborhoodId])

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

        if (diffYears >= 1) return `Présent depuis ${diffYears} an${diffYears > 1 ? "s" : ""}`
        if (diffMonths >= 1) return `Présent depuis ${diffMonths} mois`
        if (diffDays >= 1) return `Présent depuis ${diffDays} jour${diffDays > 1 ? "s" : ""}`
        if (diffHours >= 1) return `Présent depuis ${diffHours} heure${diffHours > 1 ? "s" : ""}`
        return `Présent depuis ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`
    }

    const getReadableRole = (role: string) => {
        switch (role) {
            case "admin":
                return "Admin"
            case "member":
                return "Membre"
            case "inviter":
                return "Invité"
            default:
                return "Inconnu"
        }
    }

    const handleClickBack = () => router.back()
    const handleClickChat = () => router.push(`/chat`)
    const handleClickInformation = () => router.push(`${NeighborhoodId}/information`)
    const handleClickSetting = () => router.push(`${NeighborhoodId}/setting`)

    return (
        <div className="flex">
            <ToastContainer />
            {/* Sidebar */}
            <div className="w-1/5 p-6 flex flex-col items-center gap-6">
                <div className="w-full flex flex-col items-center space-y-4 py-6">
                    <h1 className="text-4xl font-extrabold tracking-wide">{neighborhood?.name}</h1>
                    <hr className="w-full border-t-4 border-secondary"/>
                </div>
                <div className="flex flex-col gap-4 w-full items-center">
                    {loadingButtons ? (
                        [...Array(5)].map((_, idx) => (
                            <Skeleton key={idx} className="w-full h-10 rounded-md"/>
                        ))
                    ) : (
                        <>
                            <Button variant="secondary" className="w-full justify-start bg-secondary hover:bg-gray-200">
                                <Icon path={mdiBookOpenPageVariant} size={0.9} className="mr-2"/>
                                Newsletter locale
                            </Button>
                            <Button
                                variant="secondary"
                                className="w-full justify-start bg-secondary hover:bg-gray-200"
                                onClick={handleClickChat}
                            >
                                <Icon path={mdiChatOutline} size={0.9} className="mr-2"/>
                                Chat
                            </Button>
                            <Button
                                variant="secondary"
                                className="w-full justify-start bg-secondary hover:bg-gray-200"
                                onClick={handleClickInformation}
                            >
                                <Icon path={mdiMapMarker} size={0.9} className="mr-2"/>
                                Informations
                            </Button>
                            {profile?.roleInArea === "admin" && (
                                <Button onClick={handleClickSetting} variant="secondary"
                                        className="w-full justify-start bg-secondary hover:bg-gray-200">
                                    <Icon path={mdiCog} size={0.9} className="mr-2"/>
                                    Paramètres
                                </Button>
                            )}
                            <Button variant="secondary" className="w-full justify-start bg-secondary hover:bg-gray-200"
                                    onClick={handleClickBack}>
                                <Icon path={mdiLogout} size={0.9} className="mr-2"/>
                                Quitter
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 bg-white relative">
                {/* Top Bar */}
                <div className="flex flex-col items-center gap-4 bg-gray-100 rounded-xl px-4 py-3 mb-6 shadow-sm">
                    <div className="flex w-full">
                        <Avatar className="mr-2">
                            <AvatarImage src={profile?.user.image?.toString()} alt={profile?.user.firstName}/>
                            <AvatarFallback>{getInitials(profile?.user.firstName)}</AvatarFallback>
                        </Avatar>

                        {profile && neighborhood && (
                            <AddPost profileId={profile.user.id.toString()} neighborhoodId={NeighborhoodId} />
                        )}


                    </div>

                    <div className="flex justify-around text-sm text-black space-x-4 select-none w-full">
                        <div className="flex justify-center gap-1 cursor-pointer hover:text-gray-400">
                            <Icon path={mdiHandshake} size={0.9} className="mr-2"/>
                            <span>Proposer un service</span>
                        </div>
                        <div className="border-l h-5 border-gray-400"/>
                        <div className="flex justify-center gap-1 cursor-pointer hover:text-gray-400">
                            <Icon path={mdiSwapHorizontal} size={0.9} className="mr-2"/>
                            <span>Échanger</span>
                        </div>
                        <div className="border-l h-5 border-gray-400"/>
                        <div className="flex justify-center gap-1 cursor-pointer hover:text-gray-400">
                            <Icon path={mdiCompass} size={0.9} className="mr-2"/>
                            <span>Proposer une excursion</span>
                        </div>
                        <div className="border-l h-5 border-gray-400"/>
                        <div className="flex justify-center gap-1 cursor-pointer hover:text-gray-400 font-semibold">
                            <Icon path={mdiPlusBox} size={0.9} className="mr-2"/>
                            <span>Publier</span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between border-b pb-2 mb-4">
                    <div className="flex gap-6 font-medium">
                        <span className="border-b-2 border-blue-500 pb-1">All</span>
                        <span>Service</span>
                        <span>Trocs</span>
                        <span>Excursion</span>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400"/>
                        <Input className="pl-8" placeholder="Rechercher"/>
                    </div>
                </div>

                {/* Post Example */}
                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">Jean-Marie Valheur · Dec 17</div>
                            <Button variant="outline" size="sm">Excursion</Button>
                        </div>
                        <h2 className="mt-2 font-semibold text-lg">
                            What are some of the most interesting scientific facts known to you?
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Sixteen years ago, a man named Fimme Bootsma was struck with a brain aneurysm...
                            <span className="text-blue-500">(more)</span>
                        </p>
                        <img
                            src="https://images.unsplash.com/photo-1570129477492-45c003edd2be"
                            alt="Excursion"
                            className="w-full rounded-lg mt-4"
                        />
                        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                            <span>👍 Upvote · 7.3K</span>
                            <span>💬 279</span>
                            <span>👀 270</span>
                            <Button size="sm">Join the outing</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Community Member List */}
            <div className="w-1/5 bg-secondary p-6 rounded-2xl shadow-lg h-[800px]">
                <h2 className="font-semibold text-xl text-center mb-4">Membre</h2>
                <hr className="w-full border-t-4 border-white mb-6"/>
                <ScrollArea className="h-[700px] pr-2">
                    {loadingMembers ? (
                        [...Array(6)].map((_, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-2 rounded-lg">
                                <Skeleton className="w-10 h-10 rounded-full"/>
                                <div className="flex flex-col flex-1 space-y-1">
                                    <Skeleton className="h-4 w-24 rounded-md"/>
                                    <Skeleton className="h-3 w-32 rounded-md"/>
                                    <Skeleton className="h-3 w-16 rounded-md"/>
                                </div>
                            </div>
                        ))
                    ) : (
                        userNeighborhoods.map((user) => (
                            <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg">
                                <Avatar>
                                    <AvatarImage src={user.user.image?.toString()} alt={user.user.firstName}/>
                                    <AvatarFallback
                                        className="bg-white">{getInitials(user.user.firstName)}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <p className="font-medium text-sm">
                                        {user.user.firstName} {user.user.lastName}
                                    </p>
                                    <p className="text-xs text-muted-foreground italic">
                                        {getReadableRole(user.roleInArea)} - {false ? (
                                        <span className="text-green-500">En ligne</span>
                                    ) : (
                                        <span className="text-gray-400">Hors ligne</span>
                                    )}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatJoinedDuration(user.joinedAt)}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </ScrollArea>
            </div>
        </div>
    )
}

export default NeighborhoodCommunityPage
