import {Button} from '#/components/ui/button'
import {Objet} from "#/types/troc"
import Image from "next/image"
import {getObjet} from "#/lib/api_requests/troc"
type Props = { params: { id: string } };

export default async function ObjetDetailPage({params}: Props) {
    const objet:Objet = await getObjet(params.id)

    function handleModifier() {
        window.location.href= `/objet/${params.id}/edit`
    }

    function handleSupprimer() {
        fetch(`/api/objets/${params.id}`, {method: 'DELETE'})
            .then(() => window.location.href= '/troc')
    }

    return (
        <div>
            <h1>{objet.nom}</h1>
            <p>{objet.description}</p>
            <Image alt={"Image pour l'objet "+objet.nom} src={objet.image} width={200}/>
            <Button variant="outline" onClick={handleModifier}>Modifier</Button>
            <Button variant="destructive" onClick={handleSupprimer}>Supprimer</Button>
        </div>
    )
}
