"use client"

import * as React from "react"
import { Button } from "#/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "#/components/ui/form"
import { Input } from "#/components/ui/input"
import { checkResetPasswordCode, resetPassWord } from "#/lib/api_requests/auth"
import { Routes } from "#/Routes"
import { zodResolver } from "@hookform/resolvers/zod"
import { redirect } from "next/navigation"
import { useForm } from "react-hook-form"
import validator from "validator"
import z from "zod"
import { useEffect, useState } from "react"

const formSchema = z.object({
  newPassword: z.string().min(8, { message: "Le mot de passe doit comporter au moins 8 caractères" }),
  confirmPassword: z.string().min(8, { message: "La confirmation du mot de passe doit comporter au moins 8 caractères" }),
})

export default function ResetPasswordPage({ params }: { params: Promise<{ email: string }> }) {
  const email = decodeURIComponent(React.use(params).email)
  const [isChecking, setIsChecking] = useState(true)
  const [isValidCode, setIsValidCode] = useState<boolean>(false)
  const [isHide1, setIsHide1] = useState(false)
  const [isHide2, setIsHide2] = useState(false)

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const code = searchParams.get("code")

    async function validateCode() {
      if (!email || !code || !validator.isEmail(email)) {
        setIsValidCode(false)
        setIsChecking(false)
        return
      }
      const isValideCode = await checkResetPasswordCode(email, code)
      setIsValidCode(isValideCode)
      setIsChecking(false)
    }

    validateCode()
  }, [email])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { newPassword, confirmPassword } = values
    if (newPassword !== confirmPassword) {
      form.setError("confirmPassword", { type: "manual", message: "Les mots de passe ne correspondent pas" })
      return
    }
    if (newPassword.length < 8) {
      form.setError("newPassword", { type: "manual", message: "Le mot de passe doit comporter au moins 8 caractères" })
      return
    }
    form.setError("confirmPassword", { type: "manual", message: undefined })
    form.setError("newPassword", { type: "manual", message: undefined })

    const response = await resetPassWord(email, newPassword)
    if (!response.ok) {
      const errorData = await response.json()
      form.setError("newPassword", { type: "manual", message: errorData.error || "Échec de la réinitialisation du mot de passe" })
      return
    }
    form.reset()
    redirect(Routes.auth.login.toString())
  }

  if (isChecking) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Vérification...</h1>
      </div>
    )
  }

  if (!isValidCode) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Invalid Request or Reset Code</h1>
        <p className="mb-6">Please provide a valid email and reset code.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Réinitialiser le mot de passe</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
          <FormItem>
            <FormLabel>Nouveau mot de passe</FormLabel>
            <div className="relative">
            <FormControl>
              <Input
              type={isHide1 ? "password" : "text"}
              {...field}
              className="pr-10"
              />
            </FormControl>
            <button
              type="button"
              onClick={() => setIsHide1(!isHide1)}
              className="absolute inset-y-0 right-2 flex items-center text-lg focus:outline-none"
              tabIndex={-1}
              aria-label={isHide1 ? "Afficher le mot de passe" : "Cacher le mot de passe"}
            >
              {isHide1 ? "👁️" : "🙈"}
            </button>
            </div>
            <FormMessage />
          </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
          <FormItem>
            <FormLabel>Confirmer le mot de passe</FormLabel>
            <div className="relative">
            <FormControl>
              <Input
              type={isHide2 ? "password" : "text"}
              {...field}
              className="pr-10"
              />
            </FormControl>
            <button
              type="button"
              onClick={() => setIsHide2(!isHide2)}
              className="absolute inset-y-0 right-2 flex items-center text-lg focus:outline-none"
              tabIndex={-1}
              aria-label={isHide2 ? "Afficher le mot de passe" : "Cacher le mot de passe"}
            >
              {isHide2 ? "👁️" : "🙈"}
            </button>
            </div>
            <FormMessage />
          </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Envoyer</Button>
        </form>
      </Form>
      </div>
    </div>
  )
}
