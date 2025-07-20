import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar"
import { Button } from "#/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "#/components/ui/form"
import { Input } from "#/components/ui/input"
import { getProfile, updateUser } from "#/lib/api_requests/user"
import { UserProfile } from "#/types/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"

const formSchema = z.object({
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  image: z
    .string()
    .url("L'image doit être une URL valide")
    .optional()
    .or(z.literal("").optional())
})

export function UserInformation({ profile, setProfile }: { profile: UserProfile, setProfile: (profile: UserProfile) => void }) {
  const [isEditing, setIsEditing] = useState(false)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: profile!.firstName,
      lastName: profile!.lastName,
      address: profile!.address || "",
      city: profile!.city || "",
      postalCode: profile!.postalCode || "",
      image: profile!.image || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { firstName, lastName, address, city, postalCode, image } = values
    if (!firstName || firstName.length < 2) {
      form.setError("firstName", { type: "manual", message: "Veuillez entrer un prénom valide." })
      return
    }

    if (!lastName || lastName.length < 2) {
      form.setError("lastName", { type: "manual", message: "Veuillez entrer un nom valide." })
      return
    }

    const dataToSend: Partial<typeof values> = {}
    if (firstName !== profile!.firstName) dataToSend.firstName = firstName
    if (lastName !== profile!.lastName) dataToSend.lastName = lastName
    if ((address || "") !== (profile!.address || "")) dataToSend.address = address || undefined
    if ((city || "") !== (profile!.city || "")) dataToSend.city = city || undefined
    if ((postalCode || "") !== (profile!.postalCode || "")) dataToSend.postalCode = postalCode || undefined
    if ((image || "") !== (profile!.image || "")) dataToSend.image = image || undefined

    try {
      if (Object.keys(dataToSend).length > 0) {
        await updateUser(profile!.id, dataToSend)
        const data = await getProfile()
        setProfile(data)
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      form.setError("root", { type: "manual", message: "Erreur lors de la mise à jour du profil." })
      return
    }
    setIsEditing(false)
    form.reset()
  }

  return (
    <Card className="w-full max-w-xl shadow-lg border-0 bg-white/90">
      <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-2xl font-bold text-center text-blue-200">Profil</CardTitle>
      <button
        type="button"
        className="px-3 py-1 rounded bg-blue-200 text-white font-semibold hover:bg-blue-300 transition"
        onClick={() => setIsEditing((v) => !v)}
      >
        {isEditing ? "Annuler" : "Modifier"}
      </button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-lg">
      {isEditing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex items-center gap-4 mb-2">
              <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Image de profil</FormLabel>
                <FormControl>
                  <Input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                      field.onChange(reader.result as string)
                    }
                    reader.readAsDataURL(file)
                    }
                  }}
                  />
                </FormControl>
                <FormMessage />
                </FormItem>
              )}
              />
              <Avatar className="w-20 h-20">
              <AvatarImage src={form.watch("image") || profile!.image} alt="Profile Image" className="w-20 h-20" />
              <AvatarFallback>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                </svg>
              </AvatarFallback>
              </Avatar>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Input placeholder="Adresse" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <Input placeholder="Ville" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code postal</FormLabel>
                    <FormControl>
                      <Input placeholder="Code postal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="self-end px-3 py-1 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition">
              Enregistrer
            </Button>
          </form>
        </Form>
      ) : (
        <div className="flex flex-col gap-3 px-4 py-2 bg-blue-50 rounded-lg shadow-inner">
          <div className="flex items-center gap-4 mb-2">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile!.image} alt="Profile Image" className="w-20 h-20" />
              <AvatarFallback>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-900 w-24">Prénom :</span>
                <span className="text-blue-700">{profile!.firstName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-900 w-24">Nom :</span>
                <span className="text-blue-700">{profile!.lastName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-900 w-24">Email :</span>
                <span className="text-blue-700">{profile!.email}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-blue-900 w-24">Adresse :</span>
            <span className="text-blue-700">{profile!.address || "-"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-blue-900 w-24">Ville :</span>
            <span className="text-blue-700">{profile!.city || "-"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-blue-900 w-24">Code postal :</span>
            <span className="text-blue-700">{profile!.postalCode || "-"}</span>
          </div>
        </div>
      )}
      </CardContent>
    </Card>
  )
}
