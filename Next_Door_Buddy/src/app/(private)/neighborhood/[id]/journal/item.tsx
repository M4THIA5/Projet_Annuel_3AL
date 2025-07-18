'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { deleteJournalById } from '#/lib/api_requests/jounal'
import SafeHtmlRenderer from '#/components/personal/SafeHtmlRenderer'

interface Props {
    post: {
        id: string
        title: string
        content: string
        createdAt: string
    }
}

export default function Item({ post }: Props) {
    const router = useRouter()

    const handleDelete = async (id: string) => {
        await deleteJournalById(id)
        router.refresh()
    }

    const formattedDate = new Date(post.createdAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return (
        <div className="w-full mb-10 border border-gray-800 rounded-md p-6 bg-white shadow-md font-serif">
            <header className="mb-4 border-b border-gray-300 pb-2">
                <p className="text-sm text-gray-500 mb-1">
                    Publié le <time dateTime={post.createdAt}>{formattedDate}</time> • ID: {post.id}
                </p>
                <h3 className="text-2xl font-semibold text-gray-900">{post.title}</h3>
            </header>

            <section className="text-gray-800 leading-relaxed whitespace-pre-line mb-6">
                <SafeHtmlRenderer html={post.content} />
            </section>

            <footer className="flex justify-end gap-4 text-sm">
                <a
                    href={`journal/${post.id}/update`}
                    className="text-blue-600 hover:underline font-medium"
                >
                    Modifier
                </a>
                <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 hover:underline font-medium"
                >
                    Supprimer
                </button>
            </footer>
        </div>
    )
}
