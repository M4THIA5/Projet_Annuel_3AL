'use client'

import React, {useState} from 'react'

import {SimpleEditor} from '#/components/tiptap-templates/simple/simple-editor'
import {UserNeighborhood} from '#/types/user'
import {Button} from '#/components/ui/button'
import {Card, CardContent} from '#/components/ui/card'
import {Separator} from "@radix-ui/react-menu"

interface AddPostProps {
    NeighborhoodId: string
    profile: UserNeighborhood | undefined
}

export default function AddPost({NeighborhoodId, profile}: AddPostProps) {

    const [content, setContent] = useState('')
    const user = profile?.user

    const handleCallback = (childData: string) => {
        setContent(childData)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Submitting post:', content)
        console.log('NeighborhoodId:', NeighborhoodId)
        console.log('User:', user)
        // Appel API ici
    }

    return (
        <Card className="p-6 shadow-md rounded-2xl border">
            <CardContent className="p-0 ">
                <SimpleEditor parentCallback={handleSubmit}/>
                <Separator/>
                <div className="flex justify-end">
                    <Button type="submit" className="px-6">
                        Publier
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
