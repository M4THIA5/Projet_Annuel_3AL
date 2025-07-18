import {getJournalPageById} from "#/lib/api_requests/jounal"

type Props = { params: { idJ: string } };

export default async function JournalPage({params}: Props) {
    const page = await getJournalPageById(params.idJ)
    return (
        <div className={`h-screen flex flex-col items-center justify-center`}>
            <h1>Page: {params.idJ}</h1>
            ( page ? <div>
            {page.content}
        </div> : <p>Page non trouvée</p>
        </div>
    )
}
