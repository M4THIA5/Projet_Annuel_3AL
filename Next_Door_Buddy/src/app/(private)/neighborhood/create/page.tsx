"use client"

import {useEffect, useState} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "#/components/ui/card"
import {Label} from "#/components/ui/label"
import {Input} from "#/components/ui/input"
import {Textarea} from "#/components/ui/textarea"
import {Button} from "#/components/ui/button"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "#/components/ui/select"

export default function NeighborhoodForm() {
    const [formData, setFormData] = useState({
        name: "",
        city: "",
        postalCode: "",
        district: "",
        members: 1,
        description: "",
        image: null as File | null,
    })

    const [districts, setDistricts] = useState<string[]>([])
    const [loadingDistricts, setLoadingDistricts] = useState(false)

    const apiKey = "http://localhost:3001" // Remplace avec ta clé HERE

    useEffect(() => {
        const fetchDistricts = async () => {
            if (!formData.city) return

            setLoadingDistricts(true)
            try {
                const res = await fetch(
                    `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(formData.city)}&apiKey=${apiKey}`
                )
                const data = await res.json()
                const uniqueDistricts = new Set<string>()

                data.items.forEach((item: any) => {
                    const district = item.address?.district
                    if (district) {
                        uniqueDistricts.add(district)
                    }
                })

                setDistricts([...uniqueDistricts])
            } catch (err) {
                console.error("Erreur lors de la récupération des quartiers:", err)
                setDistricts([])
            } finally {
                setLoadingDistricts(false)
            }
        }

        fetchDistricts()
    }, [formData.city])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target
        setFormData(prev => ({...prev, [name]: value}))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFormData(prev => ({...prev, image: e.target.files![0]}))
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log(formData)
    }

    return (
        <Card className="max-w-xl mx-auto mt-10 p-4">
            <CardHeader>
                <CardTitle>Créer un Quartier</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nom</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required/>
                    </div>

                    <div>
                        <Label htmlFor="city">Ville</Label>
                        <Input id="city" name="city" value={formData.city} onChange={handleChange} required/>
                    </div>

                    <div>
                        <Label htmlFor="postalCode">Code Postal</Label>
                        <Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange}
                               required/>
                    </div>

                    <div>
                        <Label htmlFor="district">Quartier</Label>
                        <Select
                            value={formData.district}
                            onValueChange={(value) => setFormData(prev => ({...prev, district: value}))}
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={loadingDistricts ? "Chargement..." : "Sélectionner un quartier"}/>
                            </SelectTrigger>
                            <SelectContent>
                                {districts.map((d, idx) => (
                                    <SelectItem key={idx} value={d}>
                                        {d}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" value={formData.description}
                                  onChange={handleChange}/>
                    </div>

                    <div>
                        <Label htmlFor="image">Image</Label>
                        <Input id="image" name="image" type="file" accept="image/*" onChange={handleFileChange}/>
                    </div>

                    <Button type="submit" className="w-full">Enregistrer</Button>
                </form>
            </CardContent>
        </Card>
    )
}
