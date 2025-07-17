"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Item from './item'
import {getJournals} from "#/lib/api_requests/jounal"
import {Post} from "#/types/post"


export default function JournalPage() {

    const [posts, setPosts] = useState<{ id: string, content: string, title: string }[]>([])

    useEffect(() => {
        const fetchJournals = async () => {
            const data = await getJournals()
            setPosts(data.map(journalEntry => ({
                id: journalEntry.id,
                content: journalEntry.content,
                title: journalEntry.types.join(', ')
            })))
        }
        fetchJournals()
    }, [])

    return (
        <div className="max-w-5xl mx-auto py-20 px-4 bg-white rounded-lg shadow-lg min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-bold text-zinc-900">Journal</h1>
                <Link
                    href={"/journal/create"}
                    className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-md text-white font-medium shadow transition"
                >
                    Nouveau Journal
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts?.map((post: { id: string, content: string, title: string }, i: number) => (
                    <Item key={i} post={post} />
                )).sort().reverse()}
            </div>
            {posts.length === 0 && (
                <div className="text-center text-zinc-500 mt-20 text-lg">
                    Aucun journal pour l’instant. Cliquez sur &quot;Nouveau Journal&quot; pour ajouter votre première entrée !
                </div>
            )}
        </div>
    )
}

