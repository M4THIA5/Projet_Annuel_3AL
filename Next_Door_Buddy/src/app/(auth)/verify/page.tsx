import {Suspense} from 'react'
import OTPForm from "#/app/(auth)/verify/OTP"


export default function Page() {


    return (
        <Suspense>
            <OTPForm/>
        </Suspense>
    )
}
