'use client'

import { useState, useEffect, SetStateAction} from 'react'
import {Card, CardContent, CardHeader} from '#/components/ui/card'
import {Button} from '#/components/ui/button'
import {Label} from '#/components/ui/label'
import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from '#/components/ui/input-otp'
import {resendOtp, verifyOtp} from '#/lib/api_requests/user'
import {useRouter, useSearchParams} from 'next/navigation'
import {Routes} from '#/Routes'

export default function OTPForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get('email') ?? ''
    const [code, setCode] = useState('')
    const [error, setError] = useState('')
    const [resendCooldown, setResendCooldown] = useState(0)
    const [isResending, setIsResending] = useState(false)
    const [isVerifying, setIsVerifying] = useState(false)

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

    useEffect(() => {
        if (code.length === 6) {
            handleSubmit(code)
        }
    }, [code])

    const handleSubmit = async (code: string) => {
        setIsVerifying(true)
        setError('')
        try {
            await verifyOtp({email, otp: code})
            router.push(Routes.neighborhood.toString())
        } catch (err) {
            console.error(err)
            setError('Verification failed.')
        } finally {
            setIsVerifying(false)
        }
    }

    const handleResend = async () => {
        setIsResending(true)
        try {
            await resendOtp({email})
            startCooldown()
        } catch (err) {
            console.error('Failed to resend code', err)
        } finally {
            setIsResending(false)
        }
    }

    return (
        <form onSubmit={(e) => e.preventDefault()} className="max-w-md w-full mx-auto mt-24 px-4">
            <Card >
                <CardHeader className="text-center space-y-2">
                    <Label htmlFor="otp" className="text-lg font-semibold">
                        Enter the OTP code
                    </Label>
                    <p className="text-sm text-muted-foreground">
                        We&#39;ve sent a 6-digit code to your email or phone.
                    </p>
                </CardHeader>

                <CardContent className="space-y-4  flex justify-center w-full flex-col">
                    <InputOTP
                        className={"flex justify-center"}
                        maxLength={6}
                        value={code}
                        onChange={(val: SetStateAction<string>) => setCode(val)}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>

                    {error && (
                        <p className="text-sm text-destructive text-center">{error}</p>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        onClick={() => handleSubmit(code)}
                        disabled={code.length < 6 || isVerifying}
                    >
                        {isVerifying ? 'Verifying...' : 'Verify Code'}
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
