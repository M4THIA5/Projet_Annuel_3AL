"use client"
import { FormEvent } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { Button } from "#/components/ui/button"
import { Input } from "#/components/ui/input"
import { loginFormData, loginUser } from "#/lib/api_requests/auth"

import { useState } from "react"
import { Routes } from "#/Routes"
import { isTokenValid } from "#/lib/config"

export default function SigninPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const form = event.target as HTMLFormElement
      const formData = new FormData(form)

      const loginData = loginFormData.parse(Object.fromEntries(formData.entries()))

      const { accessToken } = await loginUser(loginData)
      if (!accessToken || !isTokenValid(accessToken.toString())) {
        throw new Error('Failed to login')
      }
 
      window.location.href = Routes.home.toString()

    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Failed to login')
      }
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex flex-col gap-4">
            <Input
              name="email"
              type="email"
              placeholder="Email"
              className="input"
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              className="input"
              required
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              Sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
