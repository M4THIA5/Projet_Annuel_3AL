"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "#/components/ui/form"
import { Input } from "#/components/ui/input"
import { Button } from "#/components/ui/button"
import { Textarea } from "#/components/ui/textarea"
import { getProfile } from "#/lib/api_requests/user"
import { Service } from "#/types/service"
import { createService } from "#/lib/api_requests/services"
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"
import { useRouter } from "next/navigation"
import {toast} from "react-toastify" // ✅ Utilise le hook App Router

const formSchema = z.object({
    title: z.string().min(5, {
        message: "Le titre doit faire au moins 5 caractères.",
    }),
    description: z.string().min(10, {
        message: "La description doit faire au moins 10 caractères.",
    }),
})

export function ProfileForm() {
    const router = useRouter() // ✅ Appelle le hook ici

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const profile = await getProfile()
        const service: Service = {
            ...values,
            asker: profile!.email,
            createdAt: new Date(),
            open: true,
        }

        await createService(service).then(() => {
            toast.success("Le service a été créé avec succès !")
            router.push("/services") // ✅ Utilise router.push (au lieu de window.location.href)
        })
    }

    const handleCancel = () => {
        form.reset()
        router.back() // ✅ Retour à la page précédente
    }

    return (
        <Card className="max-w-2xl shadow-md border rounded-2xl p-6 mb-8">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Demander un service</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">Titre</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex : Besoin d'aide pour mon jardin"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs text-muted-foreground">
                                        Indiquez clairement ce dont vous avez besoin.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Décrivez le service recherché..."
                                            className="resize-none min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs text-muted-foreground">
                                        Donnez un maximum de détails pour faciliter la compréhension.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                </Form>
            </CardContent>
        </Card>
    )
}
