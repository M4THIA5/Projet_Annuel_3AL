"use client"
import {useEffect, useState} from "react"
import {Card, CardContent} from "#/components/ui/card"
import {getNeighborhoodsAroundMe, getNeighborhoodsOfUser} from "#/lib/api_requests/neighborhood"
import logo from "@/logo.png"
import Image from "next/image"
import {Neighborhood} from "#/types/neighborghood"
import { useRouter } from 'next/navigation'
import {getProfile} from "#/lib/api_requests/user"
import { Skeleton } from "#/components/ui/skeleton"

export default function NeighborhoodsPage() {
    const router = useRouter()
    // const [profile, setProfile] = useState<UserProfile | undefined>(undefined)
    const [neighborhooduser, setNeighborhoodUser] = useState<Neighborhood[] | undefined>(undefined)
    const [neighborhoodsAround, setNeighborhoodsAround] = useState<Neighborhood[]>([])

    const handleClick = (n :Neighborhood) => {
        router.push(`/neighborhood/${n.id}`)
    }

    useEffect(() => {
        async function fetchNeighborhoods() {
            const user = await getProfile()
            // setProfile(user)
            const data = await getNeighborhoodsOfUser(user.id)
            setNeighborhoodUser(data)
            const data2 = await getNeighborhoodsAroundMe(user.id)
            setNeighborhoodsAround(data2)
        }

        fetchNeighborhoods()
    }, [])

    if (!neighborhooduser) {
        return (
            <div className="p-6 space-y-6">
                {/* Mon Quartier */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold">Mon Quartier</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {Array.from({ length: 1 }).map((_, i) => (
                            <Card key={`mon-quartier-${i}`} className="flex">
                                <div className="flex">
                                    <div className="flex flex-1/3 align-middle justify-center p-2">
                                        <Skeleton className="h-[100px] w-[150px] rounded-md" />
                                    </div>
                                    <div className="flex-2/3 flex flex-col justify-center p-2 gap-2 w-full">
                                        <Skeleton className="h-5 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Quartiers autour de moi */}
                <div>
                    <div className="flex justify-start items-center mb-2">
                        <h2 className="text-xl font-bold">Quartiers autour de moi</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Card key={`autour-${i}`} className="flex">
                                <div className="flex">
                                    <div className="flex flex-1/3 align-middle justify-center p-2">
                                        <Skeleton className="h-[100px] w-[100px] rounded-md" />
                                    </div>
                                    <div className="flex-2/3 flex flex-col justify-center p-2 gap-2 w-full">
                                        <Skeleton className="h-5 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="p-6 space-y-6 ">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Mon Quartier</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {neighborhooduser.map((n) => (
                        <Card key={n.name} className="flex" onClick={() => handleClick(n)} >
                            <div className="flex">
                                <div className="flex flex-1/3 align-middle justify-center">
                                    {n.image  ? (
                                        <img
                                            src={n.image.toString()}
                                            alt={n.name}
                                            width={150}
                                            height={100}
                                            className="rounded-md object-cover"
                                        />
                                    ) : (
                                        <Image
                                            src={logo}
                                            alt={n.name}
                                            width={150}
                                            height={100}
                                            className="rounded-md object-cover"
                                        />
                                    )}
                                </div>
                                <div className="flex-2/3">
                                    {/* Text Section */}
                                    <CardContent className="">
                                        <h3 className="text-lg font-semibold w-full">{n.name}</h3>
                                        <p className="text-sm text-muted-foreground">{n.members} Members</p>
                                        <br/>
                                        <p className="text-sm text-gray-600">{n.description}</p>
                                    </CardContent>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
            <div className="p-6 space-y-6  ">
                <div className="flex justify-start items-center">
                    <h2 className="text-xl font-bold">Quartiers autours de moi </h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {neighborhoodsAround.map((n) => (
                        <Card key={n.name} className="flex" onClick={() => handleClick(n)}>
                            <div className="flex">
                                <div className="flex flex-1/3 align-middle justify-center">
                                    {n.image ? (
                                        <Image
                                            src={n.image.toString()}
                                            alt={n.name}
                                            width={100}
                                            height={100}
                                            className="rounded-md object-cover"
                                        />
                                    ) : (
                                        <Image
                                            src={logo}
                                            alt=""
                                            width={100}
                                            height={100}
                                            className="rounded-md object-cover "
                                        />
                                    )}
                                </div>
                                <div className="flex-2/3">
                                    {/* Text Section */}
                                    <CardContent className="">
                                        <h3 className="text-lg font-semibold w-full">{n.name}</h3>
                                        <p className="text-sm text-muted-foreground">{n.members} Members</p>
                                        <br/>
                                        <p className="text-sm text-gray-600">{n.description}</p>
                                    </CardContent>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

        </div>
    )
}
