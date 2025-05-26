import Link from 'next/link'
import React from 'react'
import Item from './item'
import {getJournals} from "#/lib/api_requests/jounal"


const Page = async () => {

    const posts: object = await getJournals()

    return (
        <div className='w-[1200px] mx-auto py-20'>
            <Link href={"/journal/create"}
                  className='px-3 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-md text-white'>Create</Link>

            <div className='grid grid-cols-3 gap-5 mt-8'>
                {posts?.map((post: { id: string, content: string, title: string }, i: number) => (
                    <Item key={i} post={post}/>
                )).sort().reverse()}
            </div>
        </div>
    )
}

export default Page
