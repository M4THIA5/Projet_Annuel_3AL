"use client"

import React, {useEffect, useState} from "react"
import {Card, CardContent} from "#/components/ui/card"
import {Input} from "#/components/ui/input"
import {Textarea} from "#/components/ui/textarea"
import Image from "next/image"
import logo from "@/logo.png"
import {useRouter} from "next/navigation"
import {getProfile, getRoleInArea} from "#/lib/api_requests/user"
import {getNeighborhood, getUsersOfNeighborhood} from "#/lib/api_requests/neighborhood"
import MapNeighborhood from "#/components/personal/MapNeighborhood"
import {UserNeighborhood} from "#/types/user"
import {Button} from "#/components/ui/button"
import {Skeleton} from "#/components/ui/skeleton"

export default function NeighborhoodView({params}: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const neighborhoodId = decodeURIComponent(React.use(params).id)

    const [data, setData] = useState({
        name: '',
        city: '',
        postalCode: '',
        description: '',
        image: null as string | null,
    })

    const [users, setUsers] = useState<UserNeighborhood[]>([])
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function load() {
            try {
                setIsLoading(true)
                const user = await getProfile()
                const role = await getRoleInArea(Number(user.id), Number(neighborhoodId))
                if (role !== 'admin') {
                    router.back()
                    return
                }

                const neighborhood = await getNeighborhood(neighborhoodId)
                const image = typeof neighborhood?.image === 'string' ? neighborhood.image : null

                setData({
                    name: neighborhood?.name || '',
                    city: neighborhood?.city || '',
                    postalCode: neighborhood?.postalCode || '',
                    description: neighborhood?.description || '',
                    image,
                })
                setImagePreview(image)

                const usersOfNeighborhood = await getUsersOfNeighborhood(neighborhoodId)
                setUsers(usersOfNeighborhood)

            } catch (e) {
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        }

        load()
    }, [neighborhoodId, router])

    const handleCancel = () => router.back()

    return (
        <>
            <div className="flex ml-10 justify-between items-center mr-10">
                <h2 className="text-2xl font-bold">
                    Information du quartier
                </h2>
                <div className="bg-secondary p-1 pr-3 pl-3 rounded-sm hover:bg-gray-200">
                    <Button
                        variant="secondary"
                        onClick={handleCancel}
                    >
                        Retour
                    </Button>
                </div>
            </div>
            <Card className="max-w mx-auto m-10 p-6">
                <CardContent>
                    <form className="space-y-6" noValidate>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Colonne gauche : Image + Description */}
                            <div className="flex flex-col gap-1 justify-center">
                                {isLoading ? (
                                    <Skeleton className="w-[600px] h-[400px] rounded-lg mx-auto"/>
                                ) : (
                                    <Image
                                        src={imagePreview || logo}
                                        alt="Aperçu"
                                        width={600}
                                        height={400}
                                        className="w-[600px] h-[400px] object-cover rounded-lg border mx-auto"
                                    />
                                )}

                                <div className="text-center mt-4">
                                    {isLoading ? (
                                        <Skeleton className="h-5 w-24 mx-auto"/>
                                    ) : (
                                        <p><strong>Membres :</strong> {users.length}</p>
                                    )}
                                </div>

                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700 mb-1 mt-6"
                                >
                                    Description
                                </label>

                                {isLoading ? (
                                    <Skeleton className="h-24 w-full rounded-md"/>
                                ) : (
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Description"
                                        value={data.description}
                                        disabled
                                        maxLength={1000}
                                        rows={4}
                                    />
                                )}
                            </div>

                            {/* Colonne droite : Champs texte + Carte */}
                            <div className="flex flex-col gap-4">
                                {isLoading ? (
                                    <Skeleton className="h-10 w-full rounded-md"/>
                                ) : (
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="Nom"
                                        value={data.name}
                                        disabled
                                        minLength={2}
                                        maxLength={100}
                                    />
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    {isLoading ? (
                                        <>
                                            <Skeleton className="h-10 w-full rounded-md"/>
                                            <Skeleton className="h-10 w-full rounded-md"/>
                                        </>
                                    ) : (
                                        <>
                                            <Input
                                                id="city"
                                                name="city"
                                                placeholder="Ville"
                                                value={data.city}
                                                disabled
                                            />
                                            <Input
                                                id="postalCode"
                                                name="postalCode"
                                                placeholder="Code Postal"
                                                value={data.postalCode}
                                                disabled
                                            />
                                        </>
                                    )}
                                </div>

                                <div className="w-full">
                                    {isLoading ? (
                                        <Skeleton className="h-64 w-full rounded-md"/>
                                    ) : (
                                        <MapNeighborhood users={users}/>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}
