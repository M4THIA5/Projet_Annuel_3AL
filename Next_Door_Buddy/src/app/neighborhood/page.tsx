'use client'

import {getPotentialUser} from '#/lib/dal'
import './style.css'
import {redirect} from 'next/navigation'
import {Card, CardContent} from '#/components/ui/card'
import {Button} from '#/components/ui/button'
import {useEffect, useState} from 'react'
import {getAllNeighborhoods} from '#/lib/api_requests/neighborhood'
import Icon from "@mdi/react"
import {mdiPlusCircleOutline} from "@mdi/js"
import Image from "next/image"
import img from "@/maison.png"
import {Spinner} from "#/components/ui/loading"

const Neighborhood = () => {
    const [userData, setUserData] = useState<any>(null)
    const [neighborhoods, setNeighborhoods] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const fetchedUserData = await getPotentialUser();
            setUserData(fetchedUserData)

            const fetchedNeighborhoodsData = await getAllNeighborhoods()
            setNeighborhoods(fetchedNeighborhoodsData)
            setLoading(false)
        }

        fetchData()
    }, [])

    // if (!userData) {
    //     redirect('/login'); // ⚠️ redirect ne marche pas ici
    //     return;
    // }

    if (loading) return (<>
        <div className={"w-full h-full flex justify-center align-middle"}>
            <Spinner show={true} className={""} size={"large"}/>
        </div>
    </>)
    if (!userData) return null

    return (
        <div>
            <div className="p-6 space-y-6 ">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Mes Quartiers</h2>
                    <Button className="bg-black text-white rounded-full px-6 py-2">
                        <Icon path={mdiPlusCircleOutline} size={1}/> Create a neighborhood
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {neighborhoods.map((n) => (
                        <Card key={n.name} className="flex">
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
                                            src={img}
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
                    {neighborhoods.map((n) => (
                        <Card key={n.name} className="flex">
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
                                            src={img}
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

export default Neighborhood
