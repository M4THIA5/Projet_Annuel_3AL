'use client'

import { use } from 'react'
import { useEffect, useState } from 'react'
import Item from './item'
import { Button } from '#/components/ui/button'
import { usePathname, useRouter } from 'next/navigation'
import { getJournals } from '#/lib/api_requests/jounal'
import { Skeleton } from '#/components/ui/skeleton'

type Props = { params: Promise<{ id: string }> }

type JournalEntry = {
    id: string
    content: string
    title: string
    createdAt: string
}

type JournalsGroupedByDay = {
    day: string
    journals: JournalEntry[]
}

export default function JournalPage({ params }: Props) {
    const router = useRouter()
    const pathname = usePathname()
    const { id: neighborhoodId } = use(params)

    const [groupedJournals, setGroupedJournals] = useState<JournalsGroupedByDay[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchJournals = async () => {
        setIsLoading(true)
        const data = await getJournals()
        const filtered = data
            .filter(journal => journal.districtId.toString() === neighborhoodId)
            .map(journal => ({
                id: journal.id,
                content: journal.content,
                title: journal.types.join(', '),
                createdAt: journal.createdAt,
            }))

        const grouped = filtered.reduce((acc: { [key: string]: JournalEntry[] }, entry) => {
            const day = new Date(entry.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            })
            if (!acc[day]) acc[day] = []
            acc[day].push(entry)
            return acc
        }, {})

        const groupedArray: JournalsGroupedByDay[] = Object.entries(grouped)
            .map(([day, journals]) => ({ day, journals }))
            .sort((a, b) => {
                const dateA = new Date(a.journals[0].createdAt).getTime()
                const dateB = new Date(b.journals[0].createdAt).getTime()
                return dateB - dateA
            })

        setGroupedJournals(groupedArray)
        setIsLoading(false)
    }

    useEffect(() => {
        fetchJournals()
    }, [neighborhoodId])

    return (
        <div className="max-w-5xl mx-auto py-20 px-4 bg-white rounded-lg shadow-lg min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-bold text-zinc-900">Journal</h1>
                <Button
                    onClick={() => router.push(`${pathname}/create`)}
                    className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-md text-white font-medium shadow transition"
                >
                    Nouveau Journal
                </Button>
            </div>

            {isLoading ? (
                <div className="space-y-16">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i}>
                            <Skeleton className="h-8 w-48 mb-6" />
                            <div className="space-y-4">
                                {Array.from({ length: 2 }).map((_, j) => (
                                    <Skeleton key={j} className="h-24 w-full rounded-md" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : groupedJournals.length === 0 ? (
                <div className="text-center text-zinc-500 mt-20 text-lg">
                    Aucun journal pour l’instant. Cliquez sur &quot;Nouveau Journal&quot; pour ajouter votre première entrée !
                </div>
            ) : (
                <div className="space-y-16">
                    {groupedJournals.map(({ day, journals }) => {
                        const reversedJournals = [...journals].reverse()
                        return (
                            <div key={day}>
                                <h2 className="text-3xl font-extrabold mb-8 border-b border-gray-400 pb-2">{day}</h2>
                                {reversedJournals.map(journal => (
                                    <Item key={journal.id} post={journal} onDeleted={fetchJournals} />
                                ))}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
