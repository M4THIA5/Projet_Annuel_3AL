'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { Label } from '#/components/ui/label'
import { cn } from '#/lib/utils'
import { resendOtp, verifyOtp } from '#/lib/api_requests/user'
import {useRouter, useSearchParams} from "next/navigation";
import {Routes} from "#/Routes";

export default function OTPForm() {
    const router = useRouter();
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
    const [error, setError] = useState('')
    const [resendCooldown, setResendCooldown] = useState(0)
    const [isResending, setIsResending] = useState(false)
    const inputs = useRef<Array<HTMLInputElement | null>>([])
    const searchParams = useSearchParams()
    const email = searchParams.get('email') ?? ''

    const startCooldown = () => {
        setResendCooldown(30)
        const interval = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }

    const handleChange = (index: number, value: string) => {
        if (/^\d?$/.test(value)) {
            const newOtp = [...otp]
            newOtp[index] = value
            setOtp(newOtp)
            if (value && index < 5) {
                inputs.current[index + 1]?.focus()
            }
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1]?.focus()
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const code = otp.join('')
        if (code.length < 6) {
            setError('Please enter all 6 digits.')
        } else {
            setError('')
            console.log('OTP submitted:', code)
            try {
                await verifyOtp({ email: email, otp: code })
                router.push(Routes.neighborhood.toString())
            } catch (err) {
                console.error(err)
                setError('Verification failed.')
            }
        }
    }

    const handleResend = async () => {
        setIsResending(true)
        try {
            await resendOtp({ email: email })
            console.log('OTP code resent.')
            startCooldown()
        } catch (err) {
            console.error(err, 'Failed to resend code')
        } finally {
            setIsResending(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md w-full mx-auto mt-24 px-4">
            <Card>
                <CardHeader className="text-center space-y-2">
                    <Label htmlFor="otp" className="text-lg font-semibold">
                        Enter the OTP code
                    </Label>
                    <p className="text-sm text-muted-foreground">
                        We&#39;ve sent a 6-digit code to your email or phone.
                    </p>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="flex justify-center gap-2">
                        {otp.map((digit, index) => (
                            <Input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => (inputs.current[index] = el)}
                                className={cn(
                                    'w-12 h-12 text-center text-lg font-medium',
                                    'focus-visible:ring-2 focus-visible:ring-ring'
                                )}
                            />
                        ))}
                    </div>

                    {error && (
                        <p className="text-sm text-destructive text-center">{error}</p>
                    )}

                    <Button type="submit" className="w-full">
                        Verify Code
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                        <button
                            type="button"
                            onClick={handleResend}
                            className="underline disabled:opacity-50"
                            disabled={resendCooldown > 0 || isResending}
                        >
                            {isResending
                                ? 'Sending...'
                                : resendCooldown > 0
                                    ? `Resend available in ${resendCooldown}s`
                                    : 'Resend Code'}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}
