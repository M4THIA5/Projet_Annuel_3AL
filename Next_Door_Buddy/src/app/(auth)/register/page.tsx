"use client"
import { Button } from "#/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card"
import { Input } from "#/components/ui/input"
import { RegisterData, registerFormData, registerUser } from "#/lib/api_requests/auth"
import { Routes } from "#/Routes"
import { FormEvent, useState } from "react"




export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault()
      setIsLoading(true)
      setError(null)
  
      try {
        const form = event.target as HTMLFormElement
        const formData = new FormData(form)
  
        const loginData = registerFormData.parse(Object.fromEntries(formData.entries()))
        if (loginData.password !== loginData.confirmPassword) {
          throw new Error('Passwords do not match')
        }

        const data: RegisterData = {
          email: loginData.email,
          password: loginData.password,
          firstName: loginData.firstName,
          lastName: loginData.lastName,
        }

        await registerUser(data)

        window.location.href = Routes.login.toString()

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
              name="firstName"
              type="text"
              placeholder="First Name"
              className="input"
            />
            <Input
              name="lastName"
              type="text"
              placeholder="Last Name"
              className="input"
            />
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
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              className="input"
              required
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              Register
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
