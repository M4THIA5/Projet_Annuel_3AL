"use client"

import { Button } from "#/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "#/components/ui/form"
import { Input } from "#/components/ui/input"
import { isValidEmail, resetPassWord } from "#/lib/api_requests/user"
import validator from "validator"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { NEXT_PUBLIC_URL } from "#/lib/config"
import { Routes } from "#/Routes"
import { redirect } from "next/navigation"

const formSchema = z.object({
  email: z.string().email({ message: "Adresse email invalide" }),
})

export default function RetrievePasswordPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const email = values.email
    if (!email) {
      form.setError("email", { type: "manual", message: "Veuillez entrer une adresse e-mail." })
      return
    }
    if (!(validator.isEmail(email)) || !(isValidEmail(email))) {
      form.setError("email", { type: "manual", message: "Veuillez entrer une adresse e-mail valide." })
      return
    }
    form.setError("email", { type: "manual", message: undefined })
    const response = await resetPassWord(email, `${NEXT_PUBLIC_URL}${Routes.auth.resetPassword.whithEmail.toString(email)}`)
    if (!response.ok) {
      const errorData = await response.json()
      form.setError("email", { type: "manual", message: errorData.error || "Échec de la réinitialisation du mot de passe" })
      return
    }
    form.reset()
    return (
      <>
        <span>Un email a été envoyé, pensez vérifiez vos spam</span>
        <Button onClick={redirect(Routes.home.toString())}>Retour au login</Button>
      </>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Envoyer</Button>
      </form>
    </Form>
  )
}
