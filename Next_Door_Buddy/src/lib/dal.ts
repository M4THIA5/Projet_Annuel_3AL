"use server"
import 'server-only'


import {cookies} from 'next/headers'
import {decrypt} from '#/lib/session'
import {cache} from "react"
import {redirect} from "next/navigation"

export const verifySession = cache(async () => {
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)

    if (!session?.userId) {
        redirect('/login')
    }

    return {isAuth: true, userId: session.userId, username:session.username}
})

export const getUser = cache(async () => {
    const session = await verifySession()
    if (!session) return null
    return session
})

export const getPotentialUser = cache(async () => {
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)
    if (!session) return null
    return session

})


