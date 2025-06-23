"use client"

import React, {useEffect, useState} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "#/components/ui/card"
import {Input} from "#/components/ui/input"
import {Textarea} from "#/components/ui/textarea"
import {Button} from "#/components/ui/button"
import Image from "next/image"
import logo from "@/logo.png"
import {useRouter} from "next/navigation"
import {getProfile, getRoleInArea} from "#/lib/api_requests/user"
import {getNeighborhood, updateNeighborhood} from "#/lib/api_requests/neighborhood"
import {Neighborhood} from "#/types/neighborghood"

export default function NeighborhoodForm({params}: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const NeighborhoodId = decodeURIComponent(React.use(params).id)
    const [neighborhood, setNeighborhood] = useState<Neighborhood | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        postalCode: '',
        description: '',
        image: null as File | null,
    })

    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})


    useEffect(() => {
        async function fetchNeighborhood() {
            try {
                const user = await getProfile()
                const role = await getRoleInArea(Number(user.id), Number(NeighborhoodId))
                if (role !== 'admin') {
                    router.back()
                }

                const neighborhoodData = await getNeighborhood(NeighborhoodId)
                setNeighborhood(neighborhoodData)

                if (neighborhoodData) {
                    setFormData({
                        name: neighborhoodData.name || '',
                        city: neighborhoodData.city || '',
                        postalCode: neighborhoodData.postalCode || '',
                        description: neighborhoodData.description || '',
                        image: null,
                    })
                }

            } catch (error) {
                console.error("Erreur lors du chargement du quartier ou des utilisateurs :", error)
            }
        }

        fetchNeighborhood()
    }, [NeighborhoodId])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target
        setFormData((prev) => ({...prev, [name]: value}))
        setFormErrors((prev) => ({...prev, [name]: ""}))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            setFormData((prev) => ({...prev, image: file}))
            setFormErrors((prev) => ({...prev, image: ""}))

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
            updateNeighborhood(Number(NeighborhoodId), formData)
                .then(() => {
                    handleCancel()
                }).catch(() => {
                alert('Une erreur est survenue lors de la mise à jour. Veuillez réessayer.')
            })
        }
    }


    return (<>
        <div className="flex justify-between items-center  p-6 pb-1 space-y-6">
            <h2 className="text-xl font-bold">Setting</h2>
        </div>
        <Card className="max-w mx-auto m-10 p-6">
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    {/* Image + Champs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Image */}
                        <div className="flex flex-col gap-1 justify-center">
                            <Image
                                src={imagePreview || logo}
                                alt="Aperçu"
                                width={300}
                                height={200}
                                className={`w-[300px] h-[200px] object-cover rounded-lg border mx-auto ${
                                    formErrors.image ? "border-red-500" : ""
                                }`}
                            />
                            <Input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                required
                                className={formErrors.image ? "border-red-500" : ""}
                            />
                            {formErrors.image && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.image}</p>
                            )}
                        </div>

                        {/* Champs texte */}
                        <div className="flex flex-col gap-4">
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
                            {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}

                            <div className="grid grid-cols-2 gap-4">
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
                            </div>

                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Description"
                                value={formData.description}
                                onChange={handleChange}
                                maxLength={1000}
                                rows={4}
                            />
                        </div>
                    </div>

                    {/* Boutons */}
                    <div className="flex justify-end gap-4 mt-4">
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            Annuler
                        </Button>
                        <Button type="submit">Enregistrer</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </>)
}
