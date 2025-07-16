"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent } from "#/components/ui/card"
import { Input } from "#/components/ui/input"
import { Textarea } from "#/components/ui/textarea"
import { Button } from "#/components/ui/button"
import Image from "next/image"
import logo from "@/logo.png"
import { useRouter } from "next/navigation"
import { getProfile, getRoleInArea } from "#/lib/api_requests/user"
import {
    getNeighborhood,
    getUsersOfNeighborhood,
    updateNeighborhood,
} from "#/lib/api_requests/neighborhood"
import { Neighborhood } from "#/types/neighborghood"
import {useRouter} from "next/navigation"
import {getProfile, getRoleInArea} from "#/lib/api_requests/user"
import {getNeighborhood, getUsersOfNeighborhood, updateNeighborhood} from "#/lib/api_requests/neighborhood"
import MapNeighborhood from "#/components/personal/MapNeighborhood"
import { UserNeighborhood } from "#/types/user"
import { Skeleton } from "#/components/ui/skeleton"

export default function NeighborhoodForm({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const NeighborhoodId = decodeURIComponent(React.use(params).id)
    const [userNeighborhoods, setUserNeighborhoods] = useState<UserNeighborhood[]>([])

    const [formData, setFormData] = useState({
        name: '',
        city: '',
        postalCode: '',
        description: '',
        image: null as File | string | null,
    })

    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})

    const isLoading = formData.name === ''

    useEffect(() => {
        async function fetchNeighborhood() {
            try {
                const user = await getProfile()
                const role = await getRoleInArea(Number(user.id), Number(NeighborhoodId))
                if (role !== 'admin') {
                    router.back()
                }

                const neighborhoodData = await getNeighborhood(NeighborhoodId)

                if (neighborhoodData) {
                    let image: string | null = null

                    if (typeof neighborhoodData.image === 'string') {
                        image = neighborhoodData.image
                    }

                    setFormData({
                        name: neighborhoodData.name || '',
                        city: neighborhoodData.city || '',
                        postalCode: neighborhoodData.postalCode || '',
                        description: neighborhoodData.description || '',
                        image: image,
                    })

                    setImagePreview(image)
                }

                const userNeighborhoodsData: UserNeighborhood[] = await getUsersOfNeighborhood(NeighborhoodId)
                setUserNeighborhoods(userNeighborhoodsData)

            } catch (error) {
                console.error("Erreur lors du chargement du quartier ou des utilisateurs :", error)
            }
        }

        fetchNeighborhood()
    }, [NeighborhoodId])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]

            // Vérification de type MIME (image uniquement)
            if (!file.type.startsWith("image/")) {
                setFormErrors((prev) => ({
                    ...prev,
                    image: "Seuls les fichiers image sont autorisés.",
                }))
                setFormData((prev) => ({ ...prev, image: null }))
                setImagePreview(null)
                return
            }

            setFormData((prev) => ({ ...prev, image: file }))
            setFormErrors((prev) => ({ ...prev, image: "" }))

            const reader = new FileReader()
            reader.onload = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleCancel = () => {
        router.back()
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const errors: Record<string, string> = {}

        if (!formData.name || formData.name.trim().length < 2) {
            errors.name = "Le nom doit contenir au moins 2 caractères."
        }

        if (!formData.city || !/^[A-Za-zÀ-ÿ\s\-']{2,}$/.test(formData.city.trim())) {
            errors.city = "La ville doit contenir uniquement des lettres et au moins 2 caractères."
        }

        if (!formData.postalCode || !/^\d{4,10}$/.test(formData.postalCode.trim())) {
            errors.postalCode = "Le code postal doit contenir entre 4 et 10 chiffres."
        }

        if (!formData.image) {
            errors.image = "Une image est requise."
        }

        setFormErrors(errors)

        if (Object.keys(errors).length === 0) {
            const finalFormData = new FormData()
            finalFormData.append("name", formData.name)
            finalFormData.append("city", formData.city)
            finalFormData.append("postalCode", formData.postalCode)
            finalFormData.append("description", formData.description ?? "")

            if (formData.image instanceof File) {
                finalFormData.append("image", formData.image)
            }

            updateNeighborhood(Number(NeighborhoodId), finalFormData)
                .then(() => {
                    handleCancel()
                })
                .catch(() => {
                    alert('Une erreur est survenue lors de la mise à jour. Veuillez réessayer.')
                })
        }
    }

    return (
        <>
            <div className="flex ml-10">
                <h2 className="text-2xl font-bold">Paramètres du quartier</h2>
            </div>
            <Card className="max-w mx-auto m-10 p-6">
                <CardContent>
                    <form
                        encType="multipart/form-data"
                        method="post"
                        onSubmit={handleSubmit}
                        className="space-y-6"
                        noValidate
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1 justify-center">
                                {isLoading ? (
                                    <Skeleton className="w-[600px] h-[400px] rounded-lg mx-auto" />
                                ) : (
                                    <Image
                                        src={imagePreview || logo}
                                        alt="Aperçu"
                                        width={600}
                                        height={400}
                                        className={`w-[600px] h-[400px] object-cover rounded-lg border mx-auto ${formErrors.image ? "border-red-500" : ""
                                        }`}
                                    />
                                )}
                                <Input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    required
                                    className={formErrors.image ? "border-red-500" : ""}
                                    disabled={isLoading}
                                />
                                {formErrors.image && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.image}</p>
                                )}

                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700 mb-1 mt-6"
                                >
                                    Description
                                </label>
                                {isLoading ? (
                                    <Skeleton className="h-20 rounded-md" />
                                ) : (
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        maxLength={1000}
                                        rows={4}
                                    />
                                )}
                            </div>

                            <div className="flex flex-col gap-4">
                                {isLoading ? (
                                    <Skeleton className="h-10 rounded-md" />
                                ) : (
                                    <>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="Nom"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            disabled
                                            minLength={2}
                                            maxLength={100}
                                            className={formErrors.name ? "border-red-500" : ""}
                                        />
                                        {formErrors.name && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                                        )}
                                    </>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    {isLoading ? (
                                        <>
                                            <Skeleton className="h-10 rounded-md" />
                                            <Skeleton className="h-10 rounded-md" />
                                        </>
                                    ) : (
                                        <>
                                            <Input
                                                id="city"
                                                name="city"
                                                placeholder="Ville"
                                                value={formData.city}
                                                onChange={handleChange}
                                                required
                                                disabled
                                                className={formErrors.city ? "border-red-500" : ""}
                                            />
                                            <Input
                                                id="postalCode"
                                                name="postalCode"
                                                placeholder="Code Postal"
                                                value={formData.postalCode}
                                                onChange={handleChange}
                                                required
                                                disabled
                                                className={formErrors.postalCode ? "border-red-500" : ""}
                                            />
                                        </>
                                    )}
                                </div>

                                <div className="w-full">
                                    {isLoading ? (
                                        <Skeleton className="w-full h-60 rounded-md" />
                                    ) : (
                                        <MapNeighborhood users={userNeighborhoods} />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-4">
                            <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isLoading}>Enregistrer</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}
