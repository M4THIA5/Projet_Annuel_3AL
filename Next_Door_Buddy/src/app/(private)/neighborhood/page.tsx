"use client"
import {useEffect, useState} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "#/components/ui/card"
import {getNeighborhoodsAroundMe, getNeighborhoodsOfUser} from "#/lib/api_requests/neighborhood"
import logo from "@/logo.png"
import Image from "next/image"
import {Neighborhood} from "#/types/neighborghood"
import { useRouter } from 'next/navigation'
import {UserProfile} from "#/types/user"
import {getProfile} from "#/lib/api_requests/user"

export default function NeighborhoodsPage() {
    const router = useRouter()
    const [profile, setProfile] = useState<UserProfile | undefined>(undefined)
    const [neighborhooduser, setNeighborhoodUser] = useState<Neighborhood[] | undefined>(undefined)
    const [neighborhoodsAround, setNeighborhoodsAround] = useState<Neighborhood[]>([])

    const handleClick = (n :Neighborhood) => {
        router.push(`/neighborhood/${n.id}`)
    }

    useEffect(() => {
        async function fetchNeighborhoods() {
            const user = await getProfile()
            setProfile(user)
            const data = await getNeighborhoodsOfUser(user.id)
            setNeighborhoodUser(data)
            const data2 = await getNeighborhoodsAroundMe(user.id)
            setNeighborhoodsAround(data2)
        }

        fetchNeighborhoods()
    }, [])

    if (!neighborhooduser) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Quartiers</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">

                </CardContent>
            </Card>
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
                                    {n.image ? (
                                        <Image
                                            src={n.image}
                                            alt={n.name}
                                            width={150}
                                            height={100}
                                            className="rounded-md object-cover"
                                        />
                                    ) : (
                                        <Image
                                            src={logo}
                                            alt=""
                                            width={150}
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
                                            src={n.image}
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
