'use client'

import React, {useEffect, useState} from 'react'
import {UserProfile} from "#/types/user"
import {getprofile} from "#/lib/api_requests/user"
import {acceptRequest} from "#/lib/api_requests/services";

interface Props {
    service: {
        id?: number,
        title: string
        description: string
        askerId:number
    }
}

export default function Item({service}: Props) {
    const [profile, setProfile] = useState<UserProfile | undefined>(undefined)

    useEffect(() => {
        async function fetchProfile() {
            const data = await getprofile()
            setProfile(data)
        }
        fetchProfile()
    }, [])

    async function handleClick() {
        await acceptRequest(String(service.id))
    }
    return (
        <div className='border-2 border-black p-3 rounded-md'>
            <h1 className='text-xl font-semibold'>{service.title}</h1>
            <p>{service.description.length > 40 ? service.description.substring(0, 40) + '...' : service.description}</p>

            <div className='flex justify-end gap-3 mt-4 text-sm'>
                {String(service.askerId) !== String(profile?.id) && (<button onClick={handleClick}>Activer</button>)}
            </div>
        </div>
    )
}
