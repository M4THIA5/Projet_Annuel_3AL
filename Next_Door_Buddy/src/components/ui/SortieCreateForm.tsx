"use client"

import {Input} from "#/components/ui/input"
import {Button} from "#/components/ui/button"
import {Textarea} from "#/components/ui/textarea"
import {createSortie} from "#/lib/api_requests/sorties"
import {Card, CardContent, CardHeader, CardTitle} from "#/components/ui/card"
import {useRouter} from "next/navigation"
import {toast} from "react-toastify"
import {useState} from "react"
import {Label} from '@radix-ui/react-dropdown-menu'
import Autocomplete from "react-google-autocomplete"

export function SortieCreateForm() {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [maxParticipant, setMaxParticipant] = useState<number>(2)
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
                maxParticipants: maxParticipant
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

                        <Label className="text-sm font-medium">Max participant</Label>
                        <Input
                            name="maxParticipant"
                            placeholder="2 minimum"
                            type="number"
                            min="2"
                            max="50"
                            onChange={(event) => setMaxParticipant(Number(event.target.value))}
                        />
                        <div className="text-xs text-muted-foreground">
                            Donnez un titre à la sortie que vous allez faire.
                        </div>
                    </div>

                    <div>
                        <Label className="text-sm font-medium">Lieu</Label>
                        <Autocomplete
                            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                            onPlaceSelected={(place) => {
                                let final = ""
                                if (!place.address_components) {
                                    final = place.formatted_address ?? "Pas d'adresse fournie."
                                } else {
                                    for (const l of place.address_components) {
                                        final += " " + l.long_name
                                    }
                                }
                                setPlace(final)
                            }}
                            options={{
                                types: ["street_address", "sublocality_level_1", "route", "locality"],
                                componentRestrictions: {country: "fr"},
                            }}
                            className=" file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                        />
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
