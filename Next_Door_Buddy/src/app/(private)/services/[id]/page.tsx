import {acceptRequest, getServiceById, deleteRequest} from "#/lib/api_requests/services"
import {Button} from "#/components/ui/button"
import {getprofile} from "#/lib/api_requests/user"

type Props = { params: { id: string } };

async function acceptReq(id: string): Promise<void> {
    return await acceptRequest(id)
}

async function deleteReq(id: string): Promise<void> {
    return await deleteRequest(id)
}

function update(id:string):void {
    window.location.href = 'services/'+id+'/update'
}

export default async function Services({params}: Props) {
    const service = await getServiceById(Number.parseInt(params.id))
    const user = await getprofile()
    return (
        <div className={`h-screen flex flex-col items-center justify-center`}>
            <h1>{service.title}</h1>
            <p>{service.description}</p>
            <Button variant={"default"} onClick={() => acceptReq(params.id)}> Accept the service request</Button>
            {Number.parseInt(user.id) === service.askerId && <>
                <Button variant={"destructive"} onClick={() => deleteReq(params.id)}> Delete the service
                    request</Button>
                <Button variant={"default"} onClick={() => update(params.id)}> Update the service
            request</Button>
            </>
            }
        </div>
    )
}
