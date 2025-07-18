"use client"

import {AddressAutofill} from '@mapbox/search-js-react'
import {Input} from "#/components/ui/input"
import {Button} from "#/components/ui/button"
import {Textarea} from "#/components/ui/textarea"
import {Sortie} from "#/types/sortie"
import {createSortie} from "#/lib/api_requests/sorties"
import {Card, CardContent, CardHeader, CardTitle} from "#/components/ui/card"
import {useRouter} from "next/navigation"
import {toast} from "react-toastify"
import {SetStateAction, useState} from "react"
import {Label} from '@radix-ui/react-dropdown-menu'

export function SortieCreateForm() {
    const router = useRouter()
    const handleChangeAddress = (e: { target: { name: string; value: SetStateAction<string>; }; }) => {
        setAddress((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
        setPlace(`${address["address-1"]}, ${address['address-2'] ? address['address-2'] + ', ' : ''}${address.city}, ${address.state} ${address.zip}`)
    }
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [address, setAddress] = useState({
        'address-1': '',
        'address-2': '',
        city: '',
        state: '',
        zip: ''
    })


    const [place, setPlace] = useState('')
    const [date, setDate] = useState('')
    const onSubmit = async (e: { preventDefault: () => void }) => {
        try {
            e.preventDefault()

            const sortie = {
                title: title,
                description: description,
                address: place,
                date: date,
            }

            await createSortie(sortie).then(() => {
                toast.success("La sortie a été créé avec succès !")
                router.push("/sorties")
            })

        } catch (error) {
            toast.error("Erreur lors de la création de la sortie.")
            console.error("Erreur:", error)
        }
    }

    const handleCancel = () => {
        router.back() // ✅ Retour à la page précédente
    }

    return (
        <Card className="max-w-2xl shadow-md border rounded-2xl p-6 mb-8">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Proposer une sortie</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-6">
                    <div>

                        <Label className="text-sm font-medium">Titre</Label>
                        <Input
                            name="title"
                            placeholder="Sortie au cinéma"
                            onChange={(event) => setTitle(event.target.value)}
                        />
                        <div className="text-xs text-muted-foreground">
                            Donnez un titre à la sortie que vous allez faire.
                        </div>
                    </div>

                    <div>
                        <Label className="text-sm font-medium">Description</Label>
                        <Textarea
                            name="description"
                            placeholder="Décrivez ce que vous allez faire pendant cette sortie..."
                            className="resize-none min-h-[120px]"
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <div className="text-xs text-muted-foreground">
                            Donnez un maximum de détails pour faciliter la compréhension. N&#39;hésitez pas
                            à mentionner chaque détail qui pourrait vous sembler important.
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm font-medium">Lieu</Label>
                        <input hidden={true} name="place" value={place} readOnly/>
                        <AddressAutofill accessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY ?? ""}>
                            <Input type="text" onChange={handleChangeAddress} placeholder={"Adresse"} name="address-1"
                                   autoComplete="street-address"/>
                            <Input type="text" onChange={handleChangeAddress} name="address-2"
                                   autoComplete="address-line2"/>
                            <Input type="text" onChange={handleChangeAddress} placeholder={"Ville"} name="city"
                                   autoComplete="address-level2"/>
                            <Input type="text" onChange={handleChangeAddress} placeholder={"État"} name="state"
                                   autoComplete="address-level1"/>
                            <Input type="text" onChange={handleChangeAddress} placeholder={"Code postal"} name="zip"
                                   autoComplete="postal-code"/>
                        </AddressAutofill>
                        <div className="text-xs text-muted-foreground">
                            Veuillez fournir la localisation de l&#39;événement.
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm font-medium">Date</Label>
                        <Input
                            name="date"
                            type="datetime-local"
                            placeholder="Décrivez ce que vous allez faire pendant cette sortie..."
                            onChange={(e) => setDate(new Date(e.target.value).toISOString())}
                        />
                        <div className="text-xs text-muted-foreground">
                            La date et l&#39;heure de l&#39;événement.
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleCancel}
                        >
                            Annuler
                        </Button>
                        <Button type="submit">
                            Publier la demande
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
