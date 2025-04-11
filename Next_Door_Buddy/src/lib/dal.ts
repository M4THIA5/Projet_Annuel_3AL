"use server"
import 'server-only'


import {cookies} from 'next/headers'
import {decrypt} from '#/lib/session'
import {cache} from "react";
import {redirect} from "next/navigation";

export const verifySession = cache(async () => {
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)

    if (!session?.userId) {
        redirect('/login')
    }

    return {isAuth: true, userId: session.userId}
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

export const getUserName = cache(async (user: any) => {
    if (!user) return null
    fetch(
        process.env.API_URL + '/user/' + user.userId,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        }
    )
        .then((response) => response.json())
        .then((data) => {
            user.userName = data.userName
        }
    )
    if (!user.userName) {
        return null
    }
    return user.userName
})
