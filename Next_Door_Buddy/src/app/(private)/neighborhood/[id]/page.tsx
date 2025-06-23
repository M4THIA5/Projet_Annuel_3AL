"use client"
import React, {useEffect, useState} from "react"
import {Card, CardContent} from '#/components/ui/card'
import {Button} from '#/components/ui/button'
import {Input} from '#/components/ui/input'
import {Avatar, AvatarFallback, AvatarImage} from '#/components/ui/avatar'
import {ScrollArea} from '#/components/ui/scroll-area'
import {Search} from 'lucide-react'
import {getNeighborhood, getUsersOfNeighborhood} from "#/lib/api_requests/neighborhood"
import {Neighborhood} from "#/types/neighborghood"
import {
    mdiBookOpenPageVariant,
    mdiChatOutline,
    mdiMapMarker,
    mdiLogout, mdiCog
} from "@mdi/js"
import Icon from "@mdi/react"
import {useRouter} from "next/navigation"
import {UserNeighborhood} from "#/types/user"
import {getProfile} from "#/lib/api_requests/user"

const NeighborhoodCommunityPage = ({params}: { params: Promise<{ id: string }> }) => {
    const router = useRouter()
    const [profile, setProfile] = useState<UserNeighborhood | undefined>(undefined)
    const NeighborhoodId = decodeURIComponent(React.use(params).id)
    const [neighborhood, setNeighborhood] = useState<Neighborhood | null>(null)
    const [userNeighborhoods, setUserNeighborhoods] = useState<UserNeighborhood[]>([])

    useEffect(() => {
        async function fetchNeighborhood() {
            try {
                const user = await getProfile()

                const neighborhoodData = await getNeighborhood(NeighborhoodId)
                setNeighborhood(neighborhoodData)

                const userNeighborhoodsData: UserNeighborhood[] = await getUsersOfNeighborhood(NeighborhoodId)
                setUserNeighborhoods(userNeighborhoodsData)

                const neighborhood = userNeighborhoodsData.find(n => n.userId === Number(user.id))

                if (neighborhood) {
                    const updatedUserNeighborhood: UserNeighborhood = {...neighborhood}
                    setProfile(updatedUserNeighborhood)
                } else {
                    setProfile(undefined)
                }
            } catch (error) {
                console.error("Erreur lors du chargement du quartier ou des utilisateurs :", error)
            }
        }

        fetchNeighborhood()
    }, [NeighborhoodId])

    function getInitials(value: string): string {
        if (!value) return ''

        const initials = value
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase())
            .join('')

        return initials.slice(0, 2)
    }

    function formatJoinedDuration(joinedAt: string | Date): string {
        const joinedDate = new Date(joinedAt)
        const now = new Date()

        const diffMs = now.getTime() - joinedDate.getTime()
        const diffMinutes = Math.floor(diffMs / (1000 * 60))
        const diffHours = Math.floor(diffMinutes / 60)
        const diffDays = Math.floor(diffHours / 24)
        const diffMonths = Math.floor(diffDays / 30)
        const diffYears = Math.floor(diffDays / 365)

        if (diffYears >= 1) {
            return `Présent depuis ${diffYears} an${diffYears > 1 ? 's' : ''}`
        } else if (diffMonths >= 1) {
            return `Présent depuis ${diffMonths} mois`
        } else if (diffDays >= 1) {
            return `Présent depuis ${diffDays} jour${diffDays > 1 ? 's' : ''}`
        } else if (diffHours >= 1) {
            return `Présent depuis ${diffHours} heure${diffHours > 1 ? 's' : ''}`
        } else {
            return `Présent depuis ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`
        }
    }

    function getReadableRole(role: string): string {
        switch (role) {
            case 'admin':
                return 'Admin'
            case 'member':
                return 'Membre'
            case 'inviter':
                return 'Invité'
            default:
                return 'Inconnu'
        }
    }

    const handleClickBack = () => {
        router.back()
    }
    const handleClickChat = () => {
        router.push(`/chat`)
    }

    const handleClickSetting = () => {
        router.push(NeighborhoodId.toString() + `/setting`)
    }


    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="w-1/5 p-6 flex flex-col items-center gap-6">
                <div className="w-full flex flex-col items-center space-y-4 py-6">
                    <h1 className="text-4xl font-extrabold tracking-wide">{neighborhood?.name}</h1>
                    <hr className="w-full border-t-4 border-secondary"/>
                </div>
                <div className="flex flex-col gap-4 w-full items-center ">
                    <Button variant="secondary" className="w-full justify-start bg-secondary  hover:bg-gray-200">
                        <Icon path={mdiBookOpenPageVariant} size={0.9} className="mr-2"/>
                        Local newsletter
                    </Button>
                    <Button variant="secondary" className="w-full justify-start bg-secondary  hover:bg-gray-200"
                            onClick={() => handleClickChat()}>
                        <Icon
                            path={mdiChatOutline} size={0.9} className="mr-2"/>
                        Chat
                    </Button>
                    <Button variant="secondary" className="w-full justify-start bg-secondary  hover:bg-gray-200">
                        <Icon
                            path={mdiMapMarker} size={0.9} className="mr-2"/>
                        Information
                    </Button>
                    {profile?.roleInArea === 'admin' && (
                        <Button
                            onClick={() => handleClickSetting()}
                            variant="secondary"
                            className="w-full justify-start bg-secondary hover:bg-gray-200"
                        >
                            <Icon path={mdiCog} size={0.9} className="mr-2" />
                            Settings
                        </Button>
                    )}
                    <Button variant="secondary" className="w-full justify-start bg-secondary  hover:bg-gray-200"
                            onClick={() => handleClickBack()}>
                        <Icon
                            path={mdiLogout} size={0.9} className="mr-2"/>
                        Leave
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 bg-white">
                {/* Top Bar */}
                <div className="flex items-center gap-4 mb-6">
                    <Avatar>
                        <AvatarImage src="https://via.placeholder.com/40"/>
                    </Avatar>
                    <Input
                        placeholder="What do you want to share ?"
                        className="flex-1"
                    />
                    <Button variant="outline">Offer a service</Button>
                    <Button variant="outline">Trade</Button>
                    <Button variant="outline">Propose an excursion</Button>
                    <Button>Post</Button>
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

                {/* Post */}
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
                            Sixteen years ago, a man named Fimme Bootsma was struck with a brain aneurysm
                            that left him severely handicapped... his short-term memory was gone almost
                            entirely — after just thirty minutes, he would forget everything he was told, <span
                            className="text-blue-500">(more)</span>
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
            <div className="w-1/5 bg-secondary p-6 rounded-2xl shadow-lg">
                <h2 className="font-semibold text-xl text-center  mb-4">Community member</h2>
                <hr className="w-full border-t-4 border-white mb-6"/>

                <ScrollArea className="h-[calc(100vh-160px)] pr-2">
                    {userNeighborhoods.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center gap-3  p-2 rounded-lg "
                        >
                            <Avatar>
                                <AvatarImage src={user.user.image} alt={user.user.firstName}/>
                                <AvatarFallback className="bg-white ">
                                    {getInitials(user.user.firstName)}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex flex-col">
                                <p className="font-medium text-sm ">
                                    {user.user.firstName} {user.user.lastName}
                                </p>
                                <p className="text-xs text-muted-foreground italic">
                                    {getReadableRole(user.roleInArea)} - {formatJoinedDuration(user.joinedAt)}
                                </p>
                                <p className="text-xs text-green-400 font-medium">● En ligne</p>
                                {/*<p*/}
                                {/*    className={cn(*/}
                                {/*        "text-xs font-medium",*/}
                                {/*        user.user.isOnline ? "text-green-400" : "text-red-400"*/}
                                {/*    )}*/}
                                {/*>*/}
                                {/*    ● {user.user.isOnline ? "En ligne" : "Absent"}*/}
                                {/*</p>*/}
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </div>

        </div>
    )
}

export default NeighborhoodCommunityPage
