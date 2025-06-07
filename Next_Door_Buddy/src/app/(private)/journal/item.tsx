'use client'

import React from 'react'
import {useRouter} from 'next/navigation'
import {deleteJournalById} from "#/lib/api_requests/jounal"

interface Props {
    post: {
        id: string,
        title: string
        content: string
    }
}

export default function Item({post}: Props) {

    const router = useRouter()

    const handleDelete = async (id: string) => {
        await deleteJournalById(id)

        router.refresh()
    }

    return (
        <div className='border-2 border-black p-3 rounded-md'>
            <h2 className='mb-2'>ID: {post.id}</h2>
            <h1 className='text-xl font-semibold'>{post.title}</h1>
            <p>{post.content}</p>

            <div className='flex justify-end gap-3 mt-4 text-sm'>
                <a className='font-semibold' href={`/journal/${post.id}/update/`}>Update</a>
                <button className='font-semibold text-red-500' onClick={() => handleDelete(post.id)}>Delete</button>
            </div>
        </div>
    )
}
