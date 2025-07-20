import {getJournalPageById} from "#/lib/api_requests/jounal"


export default async function Page({params}: { params: Promise<{ idJ: string }> }) {

    const page = await getJournalPageById((await params).idJ)

    return (
        <div className={`h-screen flex flex-col items-center justify-center`}>
            <h1>Page: {(await params).idJ}</h1>
            {page ? (<div>
                {page.content}
            </div>) : (<p>Page non trouvée</p>)}
        </div>
    )
}
