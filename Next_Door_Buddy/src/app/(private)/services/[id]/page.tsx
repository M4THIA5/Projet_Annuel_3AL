import { acceptRequest, getServiceById, deleteRequest } from "#/lib/api_requests/services"
import { Button } from "#/components/ui/button"
import { getProfile } from "#/lib/api_requests/user"
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"


async function acceptReq(id: string): Promise<void> {
    await acceptRequest(id)
}

async function deleteReq(id: string): Promise<void> {
    await deleteRequest(id)
}

function update(id: string): void {
    window.location.href = `/services/${id}/update`
}

export default async function SpecificService({params}: { params: Promise<{ id: string }> }) {
    const service = await getServiceById(Number.parseInt((await params).id))
    const user = await getProfile()

    const isOwner = user!.id === service.askerId

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <Card className="border rounded-2xl shadow-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-gray-700 whitespace-pre-wrap">{service.description}</p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                        {!isOwner && (
                            <Button
                                variant="default"
                                onClick={async () => acceptReq((await params).id)}
                            >
                                Accepter la demande
                            </Button>
                        )}

                        {isOwner && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={async () => update((await params).id)}
                                >
                                    Modifier le service
                                </Button>

                                <Button
                                    variant="destructive"
                                    onClick={async () => deleteReq((await params).id)}
                                >
                                    Supprimer le service
                                </Button>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
