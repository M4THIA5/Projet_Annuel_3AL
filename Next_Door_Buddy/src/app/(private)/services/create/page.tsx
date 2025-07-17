import {ProfileForm} from "#/components/ui/service-form"

export default async function create(){
    return (
        <div className={`h-screen flex flex-col items-center justify-center`}>
            <ProfileForm/>
        </div>
    )
}
