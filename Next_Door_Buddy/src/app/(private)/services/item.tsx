'use client'

import React from 'react'

interface Props {
    service: {
        id?: number | undefined,
        title: string
        description: string
    }
}

export default function Item({service}: Props) {

    return (
        <div className='border-2 border-black p-3 rounded-md'>
            <h1 className='text-xl font-semibold'>{service.title}</h1>
            <p>{service.description.length > 40 ? service.description.substring(0, 40) + '...' : service.description}</p>

            <div className='flex justify-end gap-3 mt-4 text-sm'>
            </div>
        </div>
    )
}
