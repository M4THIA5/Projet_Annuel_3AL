"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"
import { Input } from "#/components/ui/input"
import { Textarea } from "#/components/ui/textarea"
import { Button } from "#/components/ui/button"
import Image from "next/image"
import logo from "@/logo.png"
import { useRouter } from "next/navigation"
import MapNeighborhood from "#/components/personal/MapNeighborhood"

export default function NeighborhoodForm() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        city: "",
        country: "",
        address: "",
        postalCode: "",
        description: "",
        image: null as File | null,
    })

    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})
    const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null)
    const [mapVisible, setMapVisible] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
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

        if (!formData.country || !/^[A-Za-zÀ-ÿ\s\-']{2,}$/.test(formData.country.trim())) {
            errors.country = "Le pays doit contenir uniquement des lettres et au moins 2 caractères."
        }

        if (!formData.address || formData.address.trim().length < 5) {
            errors.address = "L'adresse doit contenir au moins 5 caractères."
        }

        if (!formData.postalCode || !/^\d{4,10}$/.test(formData.postalCode.trim())) {
            errors.postalCode = "Le code postal doit contenir entre 4 et 10 chiffres."
        }

        if (!formData.image) {
            errors.image = "Une image est requise."
        }

        setFormErrors(errors)

        if (Object.keys(errors).length === 0) {
            console.log("Formulaire valide:", formData)
        }
    }

    const handleGenerateMap = async () => {
        const fullAddress = `${formData.address}, ${formData.postalCode} ${formData.city}, ${formData.country}`

        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`
            )
            const data = await res.json()

            if (data.length > 0) {
                const { lat, lon } = data[0]
                setCoordinates({ latitude: parseFloat(lat), longitude: parseFloat(lon) })
                setMapVisible(true)
            } else {
                alert("Adresse introuvable.")
            }
        } catch (err) {
            console.error("Erreur de géocodage:", err)
            alert("Échec lors de la génération de la carte.")
        }
    }

    return (
        <Card className="max-w mx-auto m-10 p-6">
            <CardHeader>
                <CardTitle>Créer un Quartier</CardTitle>
            </CardHeader>
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
                                    className={formErrors.city ? "border-red-500" : ""}
                                />
                                <Input
                                    id="country"
                                    name="country"
                                    placeholder="Pays"
                                    value={formData.country}
                                    onChange={handleChange}
                                    required
                                    className={formErrors.country ? "border-red-500" : ""}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    id="address"
                                    name="address"
                                    placeholder="Adresse"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    className={formErrors.address ? "border-red-500" : ""}
                                />
                                <Input
                                    id="postalCode"
                                    name="postalCode"
                                    placeholder="Code Postal"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    required
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

                    {/* Génération de la carte */}
                    <div className="mt-6 space-y-4">
                        <Button type="button" onClick={handleGenerateMap}>
                            Régénérer la carte
                        </Button>

                        {mapVisible && coordinates && (
                            <div className="h-[500px] w-full rounded-lg border overflow-hidden">
                                <MapNeighborhood
                                    latitude={coordinates.latitude}
                                    longitude={coordinates.longitude}
                                    districtName={formData.name || "Quartier"}
                                />
                            </div>
                        )}
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
    )
}
