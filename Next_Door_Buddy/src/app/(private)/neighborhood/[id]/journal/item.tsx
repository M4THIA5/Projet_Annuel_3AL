'use client'

import React from 'react'
import { deleteJournalById } from '#/lib/api_requests/jounal'
import SafeHtmlRenderer from '#/components/personal/SafeHtmlRenderer'
import { Button } from '#/components/ui/button'
import { toast } from 'react-toastify'

interface Props {
    post: {
        id: string
        title: string
        content: string
        createdAt: string
    }
    onDeleted: () => void
}

export default function Item({ post, onDeleted }: Props) {
    const handleDelete = async (id: string) => {
        if (!confirm('Voulez-vous vraiment supprimer ce journal ?')) return

        try {
            await deleteJournalById(id)
            toast.success('Journal supprimé avec succès.')
            onDeleted()
        } catch (error) {
            toast.error('Erreur lors de la suppression du journal.')
            console.error(error)
        }
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
                <Button
                    variant="default"
                    className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-md text-white font-medium shadow transition"
                    asChild
                >
                    <a href={`journal/${post.id}/update`}>Modifier</a>
                </Button>
                <Button
                    variant="default"
                    className="px-5 py-2 bg-red-600 hover:bg-red-500 rounded-md text-white font-medium shadow transition"
                    onClick={() => handleDelete(post.id)}
                >
                    Supprimer
                </Button>
            </footer>
        </div>
    )
}
