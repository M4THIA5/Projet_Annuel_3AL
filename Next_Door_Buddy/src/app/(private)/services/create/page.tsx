import {ProfileForm} from "#/components/ui/service-form"

export default async function create(){
    return (
        <div className={`h-screen flex flex-col items-center justify-center`}>
            <h1>Create a service</h1>
            <ProfileForm/>
        </div>
    )
}
