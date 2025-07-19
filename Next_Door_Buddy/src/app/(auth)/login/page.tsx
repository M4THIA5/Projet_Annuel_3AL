"use client"

import {FormEvent, useState} from "react"
import {useRouter} from "next/navigation"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "#/components/ui/card"
import {Button} from "#/components/ui/button"
import {Input} from "#/components/ui/input"
import {loginFormData, loginUser} from "#/lib/api_requests/auth"

import {Routes} from "#/Routes"
import {isTokenValid} from "#/lib/config"
import {Mail, Lock} from "lucide-react"

export default function SigninPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const form = event.target as HTMLFormElement
            const formData = new FormData(form)
            const loginData = loginFormData.parse(Object.fromEntries(formData.entries()))

            if (!loginData.email || !loginData.password) {
                setError('Email and password are required')
                return
            }

            const {accessToken, optVerified} = await loginUser(loginData)
            if (!accessToken || !isTokenValid(accessToken.toString())) {
                setError('Failed to login')
            }

            if (!optVerified) {
                router.push(`${Routes.auth.verify.toString()}?email=${encodeURIComponent(loginData.email)}`)
            }

            const returnTo = new URLSearchParams(window.location.search).get("return_to")
            if (returnTo) {
                router.push(returnTo)
            } else {
                router.push(Routes.home.toString())
            }
        } catch (error) {
            console.error(error)
            setError('Failed to login')

        } finally {
            setIsLoading(false)
        }
    }


    return (
        <form onSubmit={handleSubmit} noValidate className="max-w-md w-full mx-auto mt-24 px-4">
            <Card className="rounded-2xl shadow-md border border-gray-200">
                <CardHeader className="text-center space-y-1">
                    <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Sign in to your account
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {error && (
                        <div className="text-sm text-red-500 bg-red-100 border border-red-200 rounded-md p-2">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                            <Input
                                name="email"
                                type="email"
                                placeholder="Email"
                                required
                                className="pl-10"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                            <Input
                                name="password"
                                type="password"
                                placeholder="Password"
                                required
                                className="pl-10"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full"
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </Button>

                        <div className="flex justify-between text-sm mt-2">
                            <a
                                href={Routes.auth.register.toString()}
                                className=" hover:underline"
                            >
                                Don&apos;t have an account ?
                            </a>
                            <a
                                href={Routes.auth.resetPassword.toString()}
                                className=" hover:underline"
                            >
                                Forgot password ?
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}
