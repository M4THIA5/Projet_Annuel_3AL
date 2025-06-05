"use client"
import React, {useEffect, useRef, useState} from 'react'
import {getJournalPageById, updateJournal} from "#/lib/api_requests/jounal"
import {SimpleEditor} from '#/components/tiptap-templates/simple/simple-editor'

type Props = { params: { id: string } };

export default function Page({params}: Props) {
    const id = useRef("")
    const [content, setContent] = useState('')

    const handleCallback = (childData: string) => {
        setContent(childData)
    }
    useEffect(() => {
        const fetchData = async () => {
            id.current = (params).id
            const res: object = await getJournalPageById(id.current)
            setContent(res.content)
        }
        fetchData()
    }, [id, params])


    return (
        <form className='w-[500px] mx-auto pt-20 flex flex-col gap-2' onSubmit={async (e) => {
            e.preventDefault()
            await updateJournal(
                id.current,
                {content: content}
            )
            window.location.href = "/journal"
        }}>
            <SimpleEditor parentCallback={handleCallback}/>
            <button>Update</button>
        </form>
    )
}


