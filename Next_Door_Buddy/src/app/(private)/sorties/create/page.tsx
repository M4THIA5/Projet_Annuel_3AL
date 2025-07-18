import {SortieCreateForm} from "#/components/ui/SortieCreateForm"

export default async function create(){
    return (
        <div className={`h-screen flex flex-col items-center justify-center`}>
            <SortieCreateForm/>
        </div>
    )
}
