"use client"

import { Button } from "#/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card"
import { Input } from "#/components/ui/input"
import { FormEvent, useState } from "react"
import { Label } from "#/components/ui/label"
import { Checkbox } from "#/components/ui/checkbox"
import { getMapBoxAdresse, getMapBoxNeighborhood } from "#/lib/api_requests/mapbox"
import { RegisterUserData } from "#/types/mapbox"
import { getAllUsers, registerUser } from "#/lib/api_requests/user"
import {Routes} from "#/Routes"
import {useRouter} from "next/navigation"

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [acceptedTerms, setAcceptedTerms] = useState(true)
    const [locationDenied, setLocationDenied] = useState(false)
    const router = useRouter()

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError(null)
        setFieldErrors({})

        const form = event.target as HTMLFormElement
        const formData = new FormData(form)
        const dataObj = Object.fromEntries(formData.entries())
        const newFieldErrors: Record<string, string> = {}

        const email = dataObj.email?.toString() ?? ''
        const password = dataObj.password?.toString() ?? ''
        const confirmPassword = dataObj.confirmPassword?.toString() ?? ''
        const firstName = dataObj.firstName?.toString() ?? ''
        const lastName = dataObj.lastName?.toString() ?? ''
        const address = dataObj.address?.toString() ?? ''
        const city = dataObj.city?.toString() ?? ''
        const postalCode = dataObj.postalCode?.toString() ?? ''

        if (!firstName) newFieldErrors.firstName = "First name is required"
        if (!lastName) newFieldErrors.lastName = "Last name is required"
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            newFieldErrors.email = "Valid email is required"
        } else {
            const users = await getAllUsers()
            const emailAlreadyUsed = users.some(user => user.email === email)
            if (emailAlreadyUsed) {
                newFieldErrors.email = "This email is already registered"
            }
        }
        if (!password || password.length < 6) newFieldErrors.password = "Password must be at least 6 characters"
        if (password !== confirmPassword) newFieldErrors.confirmPassword = "Passwords do not match"
        if (!acceptedTerms) newFieldErrors.terms = "You must accept the terms"

        if (locationDenied) {
            if (!address) {
                newFieldErrors.address = "Address is required"
            } else if (!/^[\w\s.,'-]{3,}$/i.test(address)) {
                newFieldErrors.address = "Address format is invalid"
            }

            if (!city) {
                newFieldErrors.city = "City is required"
            } else if (!/^[a-zA-ZÀ-ÿ\s-]{2,}$/i.test(city)) {
                newFieldErrors.city = "City format is invalid"
            }

            if (!postalCode) {
                newFieldErrors.postalCode = "Postal code is required"
            } else if (!/^\d{5}(-\d{4})?$/.test(postalCode)) {
                newFieldErrors.postalCode = "Postal code format is invalid"
            }
        }

        if (Object.keys(newFieldErrors).length > 0) {
            setFieldErrors(newFieldErrors)
            setIsLoading(false)
            return
        }

        try {
            let latitude: number | null = null
            let longitude: number | null = null
            let resolvedAddress: string | null = address
            let resolvedCity: string | null = city
            let resolvedPostalCode: string | null = postalCode

            try {
                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                    if (!navigator.geolocation) {
                        reject(new Error('Geolocation is not supported by your browser'))
                    }
                    navigator.geolocation.getCurrentPosition(resolve, reject)
                })

                latitude = position.coords.latitude
                longitude = position.coords.longitude

                const response = await getMapBoxAdresse(latitude, longitude)
                resolvedAddress = response.address
                resolvedCity = response.city
                resolvedPostalCode = response.postalCode

                setLocationDenied(false)
            } catch (geoErr) {
                console.warn("User denied geolocation or error occurred:", geoErr)
                setLocationDenied(true)
            }

            if (locationDenied && address && city && postalCode) {
                const fullAddress = `${address}, ${city} ${postalCode}, France`
                const response = await getMapBoxNeighborhood(fullAddress)

                if (!response || response.status !== 200 || response.city === null || response.postalCode === null) {
                    console.log('❌ Response:', response, '\n📍 Full Address:', fullAddress)
                    newFieldErrors.address = "Address not found"
                    setFieldErrors(newFieldErrors)
                    setIsLoading(false)
                    return
                } else {
                    console.log('✅ Response:', response, '\n📍 Full Address:', fullAddress)
                    latitude = response.latitude
                    longitude = response.longitude
                    resolvedAddress = response.address
                    resolvedCity = response.city
                    resolvedPostalCode = response.postalCode
                }
            }

            const data: RegisterUserData = {
                email,
                password,
                firstName,
                lastName,
                latitude,
                longitude,
                address: resolvedAddress,
                city: resolvedCity,
                postalCode: resolvedPostalCode
            }


            const response = await registerUser(data)
            if(response.ok){
                router.push(Routes.verify.toString())
            }
        } catch (err) {
            console.error(err)
            setError(err instanceof Error ? err.message : "Failed to register")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="max-w-md w-full mx-auto mt-24 px-4">
            <Card>
                <CardHeader>
                    <CardTitle>Sign in</CardTitle>
                    <CardDescription>Sign in to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="flex flex-col gap-4">
                        {[
                            { name: "firstName", placeholder: "First Name" },
                            { name: "lastName", placeholder: "Last Name" },
                            { name: "email", placeholder: "Email", type: "email" },
                            { name: "password", placeholder: "Password", type: "password" },
                            { name: "confirmPassword", placeholder: "Confirm Password", type: "password" },
                        ].map(({ name, placeholder, type = "text" }) => (
                            <div key={name}>
                                <Input name={name} type={type} placeholder={placeholder} />
                                {fieldErrors[name] && <p className="text-red-500 text-sm">{fieldErrors[name]}</p>}
                            </div>
                        ))}

                        {locationDenied && (
                            <>
                                <div>
                                    <Input name="address" placeholder="Address" />
                                    {fieldErrors.address &&
                                        <p className="text-red-500 text-sm">{fieldErrors.address}</p>}
                                </div>
                                <div>
                                    <Input name="city" placeholder="City" />
                                    {fieldErrors.city && <p className="text-red-500 text-sm">{fieldErrors.city}</p>}
                                </div>
                                <div>
                                    <Input name="postalCode" placeholder="Postal Code" />
                                    {fieldErrors.postalCode &&
                                        <p className="text-red-500 text-sm">{fieldErrors.postalCode}</p>}
                                </div>
                            </>
                        )}

                        <div className="flex items-start gap-3">
                            <Checkbox id="terms-1" defaultChecked />
                            <Label htmlFor="terms-1">Enable notifications</Label>
                        </div>

                        <div className="flex items-start gap-3">
                            <Checkbox
                                id="terms-2"
                                checked={acceptedTerms}
                                onCheckedChange={(val) => setAcceptedTerms(Boolean(val))}
                            />
                            <div className="grid gap-2">
                                <Label htmlFor="terms-2">Accept terms and conditions</Label>
                                <p className="text-muted-foreground text-sm">
                                    By clicking this checkbox, you agree to the terms and conditions.
                                </p>
                                {fieldErrors.terms && <p className="text-red-500 text-sm">{fieldErrors.terms}</p>}
                            </div>
                        </div>

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Registering..." : "Register"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}
