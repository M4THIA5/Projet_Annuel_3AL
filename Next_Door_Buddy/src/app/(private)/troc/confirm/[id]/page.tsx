"use client"
import TradeConfirmationPage from "#/app/(private)/troc/confirm/[id]/elem"
import {useEffect, useState} from "react"
import {DemandeTroc, Objet} from "#/types/troc"
import {redirect, useParams} from "next/navigation"
import {finalizeTroc, getTroc, getTrocItems, refuseTroc} from "#/lib/api_requests/troc"

export default function Confirmation() {
    const [items, setItems] = useState<{user1:string, user2:string,items: Objet[]}>()
    const [troc, setTroc] = useState<DemandeTroc>()
    const params = useParams()

    useEffect(() => {
        async function gdg() {
            const tr = await getTroc(String(params.id))
            const data = await getTrocItems(String(params.id))
            setItems(data)
            setTroc(tr)
        }

        gdg()
    }, [params.id])

    console.log(items)
    const user1Items = items?.items.filter((item: Objet) => troc?.userId === item.userId)?? []
    const user2Items = items?.items.filter((item: Objet) => troc?.helperId === item.userId)?? []

    const handleCancel = async () => {
        await refuseTroc(String(params.id)).then(val =>{
            if (val) redirect("/troc")
            else console.error("error mgl")
        })
    }
    const handleConfirm = async () => {
        await finalizeTroc(String(params.id)).then(val =>{
            if (val) redirect("/troc")
            else console.error("error mgl")
        })
    }
    return (
        <TradeConfirmationPage
            user1Name={items?.user1??""}
            user2Name={items?.user2??""}
            user1Items={user1Items}
            user2Items={user2Items}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
        />
    )
}
