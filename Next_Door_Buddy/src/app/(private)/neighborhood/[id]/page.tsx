"use client"

import React, {useState, useEffect} from "react"
import {Button} from "#/components/ui/button"
import {Avatar, AvatarFallback, AvatarImage} from "#/components/ui/avatar"
import {ScrollArea} from "#/components/ui/scroll-area"
import {Skeleton} from "#/components/ui/skeleton"
import { ToastContainer } from "react-toastify"
import {
    mdiBookOpenPageVariant,
    mdiChatOutline,
    mdiMapMarker,
    mdiLogout,
    mdiCog,
} from "@mdi/js"
import Icon from "@mdi/react"
import {useRouter} from "next/navigation"
import {getNeighborhood, getUsersOfNeighborhood} from "#/lib/api_requests/neighborhood"
import {Neighborhood} from "#/types/neighborghood"
import {getProfile} from "#/lib/api_requests/user"
import {UserNeighborhood} from "#/types/user"
import FiedGeneralNeighborhood from "#/components/personal/FiedGeneralNeighborhood"


const NeighborhoodCommunityPage = ({params}: { params: Promise<{ id: string }> }) => {
    const unwrappedParams = React.use(params)
    const NeighborhoodId = decodeURIComponent(unwrappedParams.id)
    const router = useRouter()
    const [profile, setProfile] = useState<UserNeighborhood | undefined>(undefined)
    const [neighborhood, setNeighborhood] = useState<Neighborhood | undefined>(undefined)
    const [userNeighborhoods, setUserNeighborhoods] = useState<UserNeighborhood[]>([])
    const [loadingMembers, setLoadingMembers] = useState<boolean>(true)
    const [loadingButtons, setLoadingButtons] = useState<boolean>(true)

    useEffect(() => {
        const fetchNeighborhood = async () => {
            try {
                const user = await getProfile()
                if (!user || !user.id) {
                    router.push('/login')
                    return
                }
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
    const handleClickJournal = () => router.push(`${NeighborhoodId}/journal`)
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
                            <Button variant="secondary"
                                    className="w-full justify-start bg-secondary hover:bg-gray-200"
                                    onClick={handleClickJournal}
                            >
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
                {/* Post Example */}
                <FiedGeneralNeighborhood neighborhoodId={NeighborhoodId}
                                         profile={profile}
                                         neighborhood={neighborhood} >
                </FiedGeneralNeighborhood>
            </div>

            {/* Community Member List */}
            <div className="w-1/5 bg-secondary p-6 rounded-2xl shadow-lg h-[80vh]">
                <h2 className="font-semibold text-xl text-center mb-4">Membre</h2>
                <hr className="w-full border-t-4 border-white mb-6"/>
                <ScrollArea className="h-[70vh] pr-2">
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
