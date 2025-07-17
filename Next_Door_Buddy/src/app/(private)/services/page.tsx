import {getAvailableServices} from "#/lib/api_requests/services"
import Link from "next/link"
import Item from '#/app/(private)/services/item'

export default async function Services() {
    const services = await getAvailableServices()

    return (
        <div className={`h-screen flex flex-col items-center justify-center`}>
            <h1>Services</h1>
            <Link href={"/services/create"}>Create a service</Link>
            <ul>
                {services.length >0 ? services.map(service => (
                    <Item key={service.id} service={service}/>
                )) : (
                    <li>No services available</li>
                )}


            </ul>
        </div>
    )
}
